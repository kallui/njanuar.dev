import { Link } from 'react-router-dom'
import type { PortfolioItem } from '../content'

type WorkListProps = {
  items: PortfolioItem[]
  basePath: string
  showYears?: boolean
}

export function WorkList({
  items,
  basePath,
  showYears = true,
}: WorkListProps) {
  return (
    <div className="work-list">
      {items.map((item) => (
        <Link
          key={item.slug}
          className={showYears ? 'work-item' : 'work-item work-item--no-years'}
          to={`${basePath}/${item.slug}`}
        >
          <div className="work-company">
            {item.logo ? (
              <img className="work-logo" src={item.logo} alt="" />
            ) : (
              <span className="work-logo" aria-hidden="true" />
            )}
            <span>{item.name}</span>
          </div>
          <div className="work-roles">
            {item.roles.map((role) => (
              <span key={role.title}>{role.title}</span>
            ))}
          </div>
          {showYears && (
            <div className="work-years">
              {item.roles.map((role) => (
                <span key={role.years}>{role.years}</span>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
