import { Link, useParams } from 'react-router-dom'
import { allItems } from '../content'
import { ContentBlocks } from '../components/ContentBlocks'

export function DetailPage() {
  const { slug } = useParams()
  const item = allItems.find((entry) => entry.slug === slug)

  if (!item) {
    return (
      <main>
        <Link to="/" className="back-link">
          ← Back
        </Link>
        {/* <p>Not found.</p> */}
      </main>
    )
  }

  return (
    <main>
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <header className="detail-header">
        <div className="detail-title">
          {item.logo && <img className="work-logo" src={item.logo} alt="" />}
          {item.url ? (
            <a
              className="detail-title-link"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              <h1>{item.name}</h1>
            </a>
          ) : (
            <h1>{item.name}</h1>
          )}
        </div>
        {item.roles.length === 1 && (
          <div className="detail-roles">
            {item.roles.map((role) => (
              <p key={`${role.title}-${role.years}`}>
                {role.title}
                {role.years && (
                  <span className="detail-years"> · {role.years}</span>
                )}
              </p>
            ))}
          </div>
        )}
      </header>

      {item.summary && <p className="detail-summary">{item.summary}</p>}
      {item.content && <ContentBlocks blocks={item.content} />}
    </main>
  )
}
