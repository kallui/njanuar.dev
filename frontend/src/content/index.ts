import type { PortfolioItem } from './types'
import { worksafebc } from './work/worksafebc'
import { genxys } from './work/genxys'
import { greenline } from './work/greenline'
import { benevity } from './industry/benevity'
import { ridendine } from './projects/ridendine'
import { kayo } from './projects/kayo'

export type { PortfolioItem } from './types'

export const work: PortfolioItem[] = [worksafebc, genxys, greenline]
export const industryWork: PortfolioItem[] = [benevity]
export const projects: PortfolioItem[] = [ridendine, kayo]

export const allItems: PortfolioItem[] = [
  ...work,
  ...industryWork,
  ...projects,
]
