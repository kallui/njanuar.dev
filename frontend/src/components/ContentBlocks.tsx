import type { ContentBlock } from '../content/types'
import type { ReactNode } from 'react'

function renderRichText(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (!match) return part

    return (
      <a
        key={index}
        className="inline-link"
        href={match[2]}
        target="_blank"
        rel="noreferrer"
      >
        {match[1]}
      </a>
    )
  })
}

function renderBlock(block: ContentBlock, index: number): ReactNode {
  switch (block.type) {
    case 'heading': {
      const level = block.level ?? 2
      const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3'
      return <HeadingTag key={index}>{block.text}</HeadingTag>
    }
    case 'paragraph':
      return block.text
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph, paragraphIndex) => (
          <p key={`${index}-${paragraphIndex}`}>
            {renderRichText(paragraph.trim())}
          </p>
        ))
    case 'bullets':
      return (
        <ul key={index} className="detail-bullets">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'image':
      return (
        <figure
          key={index}
          className={
            block.size === 'sm'
              ? 'detail-figure detail-figure--sm'
              : 'detail-figure'
          }
        >
          <img
            className="detail-image"
            src={block.src}
            alt={block.alt ?? ''}
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="detail-caption">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'gallery':
      return (
        <div key={index} className="detail-gallery">
          {block.images.map((image) => (
            <figure key={image.src} className="detail-figure">
              <img
                className="detail-image"
                src={image.src}
                alt={image.alt ?? ''}
                loading="lazy"
              />
              {image.caption && (
                <figcaption className="detail-caption">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )
    case 'video':
      return (
        <video
          key={index}
          className="detail-video"
          src={block.src}
          controls
          playsInline
          preload="metadata"
        />
      )
    case 'link':
      return (
        <a
          key={index}
          className="detail-link"
          href={block.url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="detail-link-title">{block.title}</span>
          {block.description && (
            <span className="detail-link-description">{block.description}</span>
          )}
          <span className="detail-link-domain">
            {new URL(block.url).hostname}
          </span>
        </a>
      )
    case 'pre':
      return (
        <pre key={index} className="detail-pre">
          {block.text}
        </pre>
      )
    case 'divider':
      return <hr key={index} className="detail-divider" />
    case 'table':
      return (
        <div key={index} className="detail-table-wrap">
          <table className="detail-table">
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'details':
      return (
        <details key={index} className="detail-disclosure">
          <summary>{block.summary}</summary>
          <div className="detail-disclosure-body">
            {block.blocks.map((inner, innerIndex) =>
              renderBlock(inner, innerIndex),
            )}
          </div>
        </details>
      )
  }
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-blocks">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
