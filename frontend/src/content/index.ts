import type { PortfolioItem } from './types'
import worksafebc from './work/worksafebc.md'
import genxys from './work/genxys.md'
import greenline from './work/greenline.md'
import benevity from './industry/benevity.md'
import drawTogether from './projects/drawtogether.md'
import ridendine from './projects/ridendine.md'
import kayo from './projects/kayo.md'
import portfolioInfra from './projects/portfolioInfra.md'
import bashScripts from './projects/bashScripts.md'
import insightUbc from './projects/insightUbc.md'
import munch from './projects/munch.md'
import visto from './projects/visto.md'
import anotherTuesday from './projects/anotherTuesday.md'

export type { PortfolioItem } from './types'

export const work: PortfolioItem[] = [worksafebc, genxys, greenline]
export const featuredProjects: PortfolioItem[] = [
  ridendine,
  drawTogether,
  benevity,
  portfolioInfra,
]
export const moreProjects: PortfolioItem[] = [
  munch,
  kayo,
  insightUbc,
  anotherTuesday,
  visto,
  bashScripts,
]

export const allItems: PortfolioItem[] = [
  ...work,
  ...featuredProjects,
  ...moreProjects,
]
