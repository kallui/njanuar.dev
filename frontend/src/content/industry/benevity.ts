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
      title: 'Multi-Agent Impact Story Generation Platform',
      years: '2026',
      dates: 'Jan - Apr 2026',
    },
  ],
  content: [
    { type: 'video', src: demoVideo },
    {
      type: 'paragraph',
      text: 'I worked with a team of 5 to build a multi-agent impact story generation platform for [Benevity](https://www.benevity.com), a company focused on helping organizations create social impact. The project aimed to address a challenge: donors often lose visibility into how their contributions create real-world impact after making a donation. To solve this, we built a platform that fetches news, generates impact stories, and distributes them to donors, allowing them to stay connected with the causes they support.',
    },
    {
      type: 'heading',
      text: 'My role',
    },
    {
      type: 'bullets',
      items: [
        'AI workflow design',
        'Prompt engineering',
        'Multi-agent orchestration',
        'DevOps & deployment',
      ],
    },
    {
      type: 'heading',
      text: 'AI Multi-Agent Story Generation Workflow',
    },
    {
      type: 'image',
      src: diagram,
      alt: 'AI multi-agent story generation workflow with QA feedback loops',
    },
    {
      type: 'paragraph',
      text: `One of my main responsibilities was designing and implementing the AI multi-agent workflow used to generate impact stories. I built the multi-agent pipeline using Google ADK and Vertex AI, orchestrating four Gemini agents responsible for RAG retrieval, grounded research, story generation, and fact validation.

The RAG agent extracts relevant information from nonprofit reports, while the Research agent gathers recent updates from external sources such as articles and organization websites. Both agents retrieve information relevant to the selected nonprofit and store key facts and source references as news items in the database.

Since AI-generated content can sometimes contain hallucinations, I designed the workflow so that the QA agent validates story drafts against the stored news and facts in our database. If hallucinations or other writing issues are detected, the QA agent can reject the story, triggering a loop in the pipeline and asking the Writer agent to revise it.`,
    },
    {
      type: 'heading',
      text: 'Scheduled News Fetching',
    },
    {
      type: 'paragraph',
      text: 'The platform also supports scheduled news fetching, allowing users to automatically discover new nonprofit updates and generate impact stories without manual input. The workflow also extracts relevant images from source websites to put in the impact stories.',
    },
    {
      type: 'heading',
      text: 'Review & Distribution Workflow',
    },
    {
      type: 'paragraph',
      text: 'After generation, stories go through a review process before reaching donors. Benevity employees and nonprofit organizations can review, edit, and approve generated stories. Once approved, users can distribute the impact stories as customized emails using SMTP delivery.',
    },
    {
      type: 'image',
      src: impactStory,
      alt: 'Example impact story email',
    },
    {
      type: 'heading',
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
    { type: 'divider' },
    {
      type: 'heading',
      text: 'TL;DR',
    },
    {
      type: 'bullets',
      items: [
        'Designed a multi-agent AI workflow using Google ADK and Vertex AI for impact story generation.',
        "Led the team's DevOps efforts, handling deployments and automated testing using Google Cloud Run, Cloud SQL, Firebase Hosting, Docker, and GitHub Actions.",
      ],
    },
  ],
}
