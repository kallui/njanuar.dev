import greenlineLogo from '../../assets/logos/greenline_36x36.png'
import type { PortfolioItem } from '../types'

export const greenline: PortfolioItem = {
  slug: 'greenline',
  name: 'Greenline',
  logo: greenlineLogo,
  url: 'https://getgreenline.co',
  roles: [
    { title: 'Software Developer Co-op', years: 'Jan - Apr 2023' },
  ],
  content: [
    {
      type: 'paragraph',
      text: 'As my first co-op, I worked as a Software Developer at [Greenline](https://getgreenline.co) (acquired by BLAZE), a cannabis point-of-sale system used by over 1,000 stores across Canada. My work involved developing features for web and tablet applications, fixing bugs, and collaborating with the development team.',
    },
    {
      type: 'heading',
      text: 'Feature Development & Collaboration',
    },
    {
      type: 'paragraph',
      text: 'I developed front-end features using React and React Native, and worked on the backend using Node.js, Express, and TypeScript. Outside of feature development, I regularly addressed high-priority bugs, helped test fellow developers’ feature branches, reviewed pull requests, and wrote tests using Jest and Mocha.js to help maintain application quality.',
    },
    {
      type: 'heading',
      text: 'End-to-End Project',
    },
    {
      type: 'paragraph',
      text: 'I had the opportunity to lead the end-to-end development of a project that involved changes across the full stack, including front-end updates, new backend API endpoints, and MySQL database queries. I planned the implementation, provided regular updates to the team, and guided the project from development to completion.',
    },
    { type: 'divider' },
    {
      type: 'heading',
      text: 'TL;DR',
    },
    {
      type: 'bullets',
      items: [
        'Developed full-stack features using React, React Native, Node.js, Express, and TypeScript.',
        'Maintain POS software used by 1,000+ retail stores across Canada.',
        'Led the end-to-end development of a project.',
        'Fixed bugs, tested features, reviewed pull requests, and wrote tests.',
      ],
    },
  ],
}
