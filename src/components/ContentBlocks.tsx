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

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={index}>{block.text}</h2>
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
                />
                {block.caption && (
                  <figcaption className="detail-caption">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
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
                  <span className="detail-link-description">
                    {block.description}
                  </span>
                )}
                <span className="detail-link-domain">
                  {new URL(block.url).hostname}
                </span>
              </a>
            )
          case 'divider':
            return <hr key={index} className="detail-divider" />
        }
      })}
    </div>
  )
}
