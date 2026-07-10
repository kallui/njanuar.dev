import type { PortfolioItem } from './types'
import { worksafebc } from './work/worksafebc'
import { genxys } from './work/genxys'
import { greenline } from './work/greenline'
import { benevity } from './industry/benevity'
import { projectA } from './projects/project-a'

export type { PortfolioItem } from './types'

export const work: PortfolioItem[] = [worksafebc, genxys, greenline]
export const industryWork: PortfolioItem[] = [benevity]
export const projects: PortfolioItem[] = [projectA]

export const allItems: PortfolioItem[] = [
  ...work,
  ...industryWork,
  ...projects,
]
