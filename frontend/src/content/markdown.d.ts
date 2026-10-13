// Content pages written in Markdown, compiled by plugins/markdownContent.ts.
declare module '*.md' {
  import type { PortfolioItem } from './types'
  const item: PortfolioItem
  export default item
}
