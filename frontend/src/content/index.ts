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
import { insightUbc } from './projects/insightUbc'
import { munch } from './projects/munch'
import { visto } from './projects/visto'
import { anotherTuesday } from './projects/anotherTuesday'

export type { PortfolioItem } from './types'

export const work: PortfolioItem[] = [worksafebc, genxys, greenline]
export const featuredProjects: PortfolioItem[] = [
  ridendine,
  drawTogether,
  benevity,
  portfolioInfra,
  insightUbc,
]
export const moreProjects: PortfolioItem[] = [
  munch,
  kayo,
  anotherTuesday,
  visto,
  bashScripts,
]

export const allItems: PortfolioItem[] = [
  ...work,
  ...featuredProjects,
  ...moreProjects,
]
