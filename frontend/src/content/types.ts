export type ContentBlock =
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'image'; src: string; alt?: string; caption?: string; size?: 'sm' }
  | {
      type: 'gallery'
      images: { src: string; alt?: string; caption?: string }[]
    }
  | { type: 'video'; src: string }
  | { type: 'link'; url: string; title: string; description?: string }
  | { type: 'pre'; text: string }
  | { type: 'divider' }

export type PortfolioItem = {
  slug: string
  name: string
  logo?: string
  url?: string
  roles: { title: string; years: string; dates: string }[]
  summary?: string
  tech?: string
  content?: ContentBlock[]
}
