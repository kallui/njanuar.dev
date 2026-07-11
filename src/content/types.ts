export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string }

export type PortfolioItem = {
  slug: string
  name: string
  logo?: string
  url?: string
  roles: { title: string; years: string }[]
  summary?: string
  content?: ContentBlock[]
}
