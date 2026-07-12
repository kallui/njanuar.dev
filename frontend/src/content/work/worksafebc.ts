import worksafebcLogo from '../../assets/logos/worksafebc_36x36.jpg'
import devopsDuck from '../../assets/pictures/worksafebc_devops_duck.jpg'
import type { PortfolioItem } from '../types'

export const worksafebc: PortfolioItem = {
  slug: 'worksafebc',
  name: 'WorkSafeBC',
  logo: worksafebcLogo,
  url: 'https://www.worksafebc.com',
  roles: [
    {
      title: 'Software Developer Co-op',
      years: '2025',
      dates: 'Sep - Dec 2025',
    },
    {
      title: 'Quality Assurance Co-op',
      years: '2024',
      dates: 'Sep - Dec 2024',
    },
  ],
  content: [
    {
      type: 'heading',
      text: 'Software Developer Co-op · Sep - Dec 2025',
    },
    {
      type: 'paragraph',
      text: 'I worked as part of the Common Engineering team, which focuses on improving developer experience across [WorkSafeBC](https://www.worksafebc.com) by establishing standardized engineering practices, tools, and workflows.',
    },
    {
      type: 'heading',
      text: 'GitHub Copilot Instructions',
    },
    {
      type: 'paragraph',
      text: 'One of the main projects was improving the adoption of GitHub Copilot within the organization. Since AI-generated code did not consistently follow internal coding standards, I explored different approaches and implemented custom GitHub Copilot instruction files for Angular development. I integrated these instructions into the standardized Angular application blueprint, so developers creating a new Angular project would have these instruction files ready to use. I presented a demo to stakeholders while answering questions and gathering feedback.',
    },

    {
      type: 'paragraph',
      text: "Here's a link to the blog post I wrote about the project:",
    },
    {
      type: 'link',
      url: 'https://wsbctechnicalblog.github.io/coop-github-copilot-instructions.html',
      title: 'Coding Standards Made Simple: Harness GitHub Copilot',
      description: 'The Challenges with Copilot Out of the Box',
    },
    {
      type: 'heading',
      text: 'Dependency Tracking',
    },
    {
      type: 'paragraph',
      text: 'I also led an initiative to improve dependency tracking across WorkSafeBC’s growing number of applications and services. I interviewed stakeholders to understand the current approach and challenges, evaluated different approaches, and presented findings through monthly project updates. At the end of the project, I delivered a final recommendation along with the implementation roadmap, estimated costs, and risk mitigation strategies.',
    },
    {
      type: 'heading',
      text: 'CI/CD & Blueprints',
    },
    {
      type: 'paragraph',
      text: 'Outside of larger projects, I contributed to the team’s day-to-day engineering work by taking tickets related to CI/CD pipeline improvements. This involved troubleshooting missing configurations and supporting the release of updated Angular and .NET application blueprints.',
    },
    {
      type: 'image',
      src: devopsDuck,
      alt: '3D-printed DevOps rubber duck',
      caption:
        'A 3D-printed rubber duck debugging companion — but this one joined the DevOps team.',
      size: 'sm',
    },
    { type: 'divider' },
    {
      type: 'heading',
      text: 'Quality Assurance Co-op · Sep - Dec 2024',
    },
    {
      type: 'paragraph',
      text: 'I worked on the Claim Management System (CMS), one of WorkSafeBC’s largest applications used by employees to manage injured workers’ claims. As part of the QA team, I worked with developers to ensure new features met both technical requirements and business needs before release.',
    },
    {
      type: 'heading',
      text: 'Testing & Defect Tracking',
    },
    {
      type: 'paragraph',
      text: 'My main responsibilities were validating new features and identifying issues early. I worked closely with user stories and business requirements to design test cases that covered a wide range of user scenarios, including different claim types, injury details, workflow conditions, and other factors. I documented defects and collaborated with developers to fix issues.',
    },
    {
      type: 'heading',
      text: 'Stakeholder Demo',
    },
    {
      type: 'paragraph',
      text: 'I also had the opportunity to present a live demo of our team’s new solution to over 100 internal stakeholders, explaining the changes and improvements compared to the previous implementation.',
    },
    { type: 'divider' },
    {
      type: 'heading',
      text: 'TL;DR',
    },
    {
      type: 'bullets',
      items: [
        'Built custom GitHub Copilot instructions for Angular applications.',
        'Led a dependency tracking initiative from research to recommendation.',
        'Helped maintain CI/CD pipelines and blueprint releases.',
        'Tested features for WorkSafeBC’s core claim management application.',
        'Designed and executed 75+ test cases.',
        'Identified and tracked 10+ defects before release.',
        'Presented a feature demo to 100+ internal stakeholders.',
      ],
    },
  ],
}
