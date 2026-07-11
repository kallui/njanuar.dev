import worksafebcLogo from '../../assets/logos/worksafebc_36x36.jpg'
import type { PortfolioItem } from '../types'

// Add images like this when you have them:
// import screenshot from '../../assets/worksafebc/screenshot.png'

export const worksafebc: PortfolioItem = {
  slug: 'worksafebc',
  name: 'WorkSafeBC',
  logo: worksafebcLogo,
  url: 'https://www.worksafebc.com',
  roles: [
    { title: 'Software Developer Co-op', years: 'Sep 2025 - Dec 2025' },
    { title: 'Quality Assurance Co-op', years: 'Sep 2024 - Dec 2024' },
  ],

  // Mix these blocks in any order:
  // { type: 'heading', text: '...' }
  // { type: 'paragraph', text: '...' }
  // { type: 'bullets', items: ['...', '...'] }
  // { type: 'image', src: screenshot, alt: '...' }
  content: [
    {
      type: 'heading',
      text: 'Software Developer Co-op · Sep - Dec 2025',
    },
    {
      type: 'paragraph',
      text: `
      I worked with the Common Engineering team, a service team responsible for improving developer experience across the organization. The team builds shared tools, templates, and standardized engineering pratices that help development teams collaborate effectively and adopt modern software development practices.
      
      I cont
      
      TL;DR
      
      `,
    },
    {
      type: 'bullets',
      items: ['Built '],
    },
    {
      type: 'heading',
      text: 'Quality Assurance Co-op · Sep – Dec 2024',
    },
    {
      type: 'paragraph',
      text: 'WorkSafeBC · Richmond, BC',
    },
    {
      type: 'bullets',
      items: [
        'Designed and executed 75+ test cases to validate software functionality and ensure technical and business requirements are aligned with the user story criteria.',
        'Identified, documented, and tracked 10+ user story defects pre-release, collaborating with developers to ensure timely resolution and improve product quality.',
        'Presented a live demo of a new feature to 100+ internal stakeholders, effectively showcasing technical details and highlighting the improvements over the previous version.',
      ],
    },
  ],
}
