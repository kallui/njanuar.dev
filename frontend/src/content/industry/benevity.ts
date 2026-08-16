import benevityLogo from '../../assets/logos/benevity_36x36.jpg'
import diagram from '../../assets/pictures/benevity_diagram.svg'
import impactStory from '../../assets/pictures/benevity_example_impact_story.png'
import demoVideo from '../../assets/pictures/benevity_demo_subtitled.mp4'
import type { PortfolioItem } from '../types'

export const benevity: PortfolioItem = {
  slug: 'benevity',
  name: 'Benevity',
  logo: benevityLogo,
  url: 'https://www.benevity.com',
  roles: [
    {
      title: 'Multi-agent AI platform',
      years: '2026',
      dates: 'Jan - Apr 2026',
    },
  ],
  summary:
    'A multi-agent AI platform that generates and distributes impact stories so donors stay connected to the real-world outcomes of their contributions.',
  tech: 'Google ADK · Vertex AI · Gemini · Cloud Run · Cloud SQL · Firebase · Docker · GitHub Actions · PostgreSQL',
  content: [
    {
      type: 'paragraph',
      text: 'I worked with a team of 5 to build a multi-agent impact story generation platform for [Benevity](https://www.benevity.com), a company focused on helping organizations create social impact. The project aimed to address a challenge: donors often lose visibility into how their contributions create real-world impact after making a donation. To solve this, we built a platform that fetches news, generates impact stories, and distributes them to donors, allowing them to stay connected with the causes they support.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'My role',
    },
    {
      type: 'bullets',
      items: [
        'AI workflow design and multi-agent orchestration',
        'Prompt engineering',
        'DevOps & deployment',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'AI Multi-Agent Story Generation Workflow',
    },
    {
      type: 'paragraph',
      text: `Designed and implemented an AI multi-agent workflow using Google ADK and Vertex AI to automate nonprofit impact story generation. The pipeline orchestrates four Gemini agents for RAG retrieval, grounded research, story generation, and fact validation.

To improve reliability and reduce hallucinations, I implemented a validation loop where generated stories are checked against retrieved sources and stored facts. The QA agent can identify issues and trigger revisions from the Writer agent before final output.`,
    },
    {
      type: 'image',
      src: diagram,
      alt: 'AI multi-agent story generation workflow with QA feedback loops',
      caption: 'AI multi-agent story generation workflow with QA feedback loops',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Scheduled News Fetching',
    },
    {
      type: 'paragraph',
      text: 'The platform also supports scheduled news fetching, allowing users to automatically discover new nonprofit updates and generate impact stories without manual input. The workflow also extracts relevant images from source websites to put in the impact stories.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Review & Distribution Workflow',
    },
    {
      type: 'paragraph',
      text: 'After generation, stories go through a review process before reaching donors. Benevity employees and nonprofit organizations can review, edit, and approve generated stories. Once approved, users can distribute the impact stories as customized emails using SMTP delivery.',
    },
    {
      type: 'paragraph',
      text: 'Below is an example of the impact story email that gets sent to donors after a story is approved.',
    },
    {
      type: 'image',
      src: impactStory,
      alt: 'Example impact story email sent to donors',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Demo Video',
    },
    { type: 'video', src: demoVideo },
    {
      type: 'heading',
      level: 2,
      text: 'DevOps & Deployment',
    },
    {
      type: 'paragraph',
      text: 'I also led the DevOps and deployment of the project.',
    },
    {
      type: 'bullets',
      items: [
        'Deployed backend services using Google Cloud Run and hosted the frontend on Firebase Hosting.',
        'Deployed the PostgreSQL database using Google Cloud SQL.',
        'Containerized the project using Docker.',
        'Implemented GitHub Actions CI/CD pipelines for automated testing and deployments.',
      ],
    },
  ],
}
