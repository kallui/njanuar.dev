import type { PortfolioItem } from './types'
import { worksafebc } from './work/worksafebc'
import { genxys } from './work/genxys'
import { greenline } from './work/greenline'
import { benevity } from './industry/benevity'
import { drawTogether } from './projects/drawtogether'
import { ridendine } from './projects/ridendine'
import { kayo } from './projects/kayo'
import { portfolioInfra } from './projects/portfolioInfra'
import { bashScripts } from './projects/bashScripts'

export type { PortfolioItem } from './types'

export const work: PortfolioItem[] = [worksafebc, genxys, greenline]
export const featuredProjects: PortfolioItem[] = [
  drawTogether,
  benevity,
  ridendine,
]
export const moreProjects: PortfolioItem[] = [
  kayo,
  portfolioInfra,
  bashScripts,
]

export const allItems: PortfolioItem[] = [
  ...work,
  ...featuredProjects,
  ...moreProjects,
]
