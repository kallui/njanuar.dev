import { Lexer, type Token, type Tokens } from 'marked'
import { parse as parseYaml } from 'yaml'
import type { Plugin } from 'vite'

// Turns a content page written in Markdown into the same PortfolioItem object
// the .ts content files export, so ContentBlocks renders it unchanged.
//
// Frontmatter (between --- lines) holds the PortfolioItem fields. The body maps to blocks:
//   # / ## / ###               heading
//   plain text                 paragraph ([text](url) links supported)
//   - item                     bullets
//   ![alt](path "caption")     image; title "sm" or "sm: caption" for the small size
//   ![](demo.mp4)              video (by file extension)
//   images on adjacent lines   gallery
//   @[title](url "desc")       link card
//   ``` fenced block ```       pre
//   ---                        divider
//   | table |                  table
//   :::details Summary ... ::: details (collapsible), may contain any other blocks

const VIDEO_EXT = /\.(mp4|webm|mov)$/i
const IMAGE_LINE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/
const LINK_CARD = /^@\[([^\]]+)\]\((\S+?)(?:\s+"([^"]*)")?\)$/

type Ctx = { file: string; imports: string[] }

// Asset paths become imports so Vite hashes and bundles them like before.
// The placeholder string is swapped for the import identifier after JSON.stringify.
function asset(ctx: Ctx, path: string): string {
  ctx.imports.push(path)
  return `__ASSET_${ctx.imports.length - 1}__`
}

function fail(ctx: Ctx, message: string): never {
  throw new Error(`${ctx.file}: ${message}`)
}

function imageBlock(ctx: Ctx, line: string) {
  const [, alt, src, title] = IMAGE_LINE.exec(line)!
  if (VIDEO_EXT.test(src)) return { type: 'video', src: asset(ctx, src) }

  const block: Record<string, unknown> = { type: 'image', src: asset(ctx, src) }
  if (alt) block.alt = alt
  let caption = title
  if (title === 'sm' || title?.startsWith('sm:')) {
    block.size = 'sm'
    caption = title.slice(3).trim()
  }
  if (caption) block.caption = caption
  return block
}

function paragraphBlocks(ctx: Ctx, raw: string) {
  const lines = raw
    .trim()
    .split('\n')
    .map((line) => line.trim())

  const card = lines.length === 1 && LINK_CARD.exec(lines[0])
  if (card) {
    const [, title, url, description] = card
    return [{ type: 'link', url, title, ...(description && { description }) }]
  }

  if (lines.every((line) => IMAGE_LINE.test(line))) {
    if (lines.length === 1) return [imageBlock(ctx, lines[0])]
    return [
      {
        type: 'gallery',
        images: lines.map((line) => {
          const [, alt, src, caption] = IMAGE_LINE.exec(line)!
          return {
            src: asset(ctx, src),
            ...(alt && { alt }),
            ...(caption && { caption }),
          }
        }),
      },
    ]
  }

  return [{ type: 'paragraph', text: lines.join('\n') }]
}

function tokenBlocks(ctx: Ctx, token: Token): unknown[] {
  switch (token.type) {
    case 'space':
      return []
    case 'heading': {
      const { depth, text } = token as Tokens.Heading
      if (depth > 3) fail(ctx, `heading level ${depth} is not supported`)
      return [{ type: 'heading', level: depth, text }]
    }
    case 'paragraph':
      return paragraphBlocks(ctx, token.raw)
    case 'list':
      return [
        {
          type: 'bullets',
          items: (token as Tokens.List).items.map((item) => item.text.trim()),
        },
      ]
    case 'code':
      return [{ type: 'pre', text: (token as Tokens.Code).text }]
    case 'hr':
      return [{ type: 'divider' }]
    case 'table': {
      const table = token as Tokens.Table
      return [
        {
          type: 'table',
          headers: table.header.map((cell) => cell.text),
          rows: table.rows.map((row) => row.map((cell) => cell.text)),
        },
      ]
    }
    default:
      fail(ctx, `unsupported Markdown "${token.raw.trim().slice(0, 40)}"`)
  }
}

function parseBody(ctx: Ctx, body: string): unknown[] {
  const blocks: unknown[] = []
  const lines = body.split('\n')
  let chunk: string[] = []

  const flush = () => {
    for (const token of Lexer.lex(chunk.join('\n'))) {
      blocks.push(...tokenBlocks(ctx, token))
    }
    chunk = []
  }

  for (let i = 0; i < lines.length; i++) {
    const open = /^:::details\s+(.+)$/.exec(lines[i].trim())
    if (!open) {
      chunk.push(lines[i])
      continue
    }

    flush()
    let depth = 1
    const inner: string[] = []
    for (i++; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith(':::details')) depth++
      if (line === ':::' && --depth === 0) break
      inner.push(lines[i])
    }
    if (depth !== 0)
      fail(ctx, `":::details ${open[1]}" is missing its closing :::`)
    blocks.push({
      type: 'details',
      summary: open[1],
      blocks: parseBody(ctx, inner.join('\n')),
    })
  }
  flush()

  return blocks
}

export function markdownToModule(source: string, file: string): string {
  const ctx: Ctx = { file, imports: [] }
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!match) fail(ctx, 'missing --- frontmatter block')

  const meta = parseYaml(match[1]) ?? {}
  for (const field of ['slug', 'name', 'roles']) {
    if (meta[field] === undefined)
      fail(ctx, `frontmatter is missing "${field}"`)
  }
  if (meta.logo) meta.logo = asset(ctx, meta.logo)

  const item = {
    ...meta,
    content: parseBody(ctx, match[2].replace(/\r\n/g, '\n')),
  }

  const imports = ctx.imports
    .map((path, i) => `import __asset${i} from ${JSON.stringify(path)}`)
    .join('\n')
  const json = JSON.stringify(item, null, 2).replace(
    /"__ASSET_(\d+)__"/g,
    '__asset$1',
  )
  return `${imports}\n\nexport default ${json}\n`
}

export function markdownContent(): Plugin {
  return {
    name: 'markdown-content',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('.md')) return null
      return { code: markdownToModule(source, id), map: null }
    },
  }
}
