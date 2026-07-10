import worksafebcLogo from '../../assets/logos/worksafebc_36x36.jpg'
import type { PortfolioItem } from '../types'

// Add images like this when you have them:
// import screenshot from '../../assets/worksafebc/screenshot.png'

export const worksafebc: PortfolioItem = {
  slug: 'worksafebc',
  name: 'WorkSafeBC',
  logo: worksafebcLogo,
  roles: [
    { title: 'Software Developer Co-op', years: 'Jan 2025 - Apr 2025' },
    { title: 'Quality Assurance Co-op', years: 'Sep 2024 - Dec 2024' },
  ],
  summary: 'Software Developer Co-op at WorkSafeBC (Richmond, BC).',

  // Mix these blocks in any order:
  // { type: 'heading', text: '...' }
  // { type: 'paragraph', text: '...' }
  // { type: 'bullets', items: ['...', '...'] }
  // { type: 'image', src: screenshot, alt: '...' }
  content: [
    {
      type: 'heading',
      text: 'What I worked on',
    },
    {
      type: 'paragraph',
      text: 'Focused on developer tooling, CI/CD, and improving how teams ship Angular and .NET blueprints.',
    },
    {
      type: 'bullets',
      items: [
        'Designed and implemented custom GitHub Copilot instruction files for Angular to align AI-generated code with internal UI/UX standards. Integrated changes into shared blueprint templates and presented a demo to engineering leadership.',
        'Fixed and updated CI/CD pipelines by adding missing configuration files and supporting the release of updated Angular and .NET blueprint templates through the self-service portal.',
        'Led a dependency tracking initiative by interviewing stakeholders, evaluating various approaches, presenting in monthly project updates, and delivering a final recommendation with risk mitigation and implementation roadmap.',
      ],
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
