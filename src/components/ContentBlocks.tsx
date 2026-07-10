import type { ContentBlock } from '../content/types'

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={index}>{block.text}</h2>
          case 'paragraph':
            return <p key={index}>{block.text}</p>
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
              <img
                key={index}
                className="detail-image"
                src={block.src}
                alt={block.alt ?? ''}
              />
            )
        }
      })}
    </div>
  )
}
