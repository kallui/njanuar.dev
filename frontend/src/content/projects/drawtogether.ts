import drawTogetherLogo from '../../assets/logos/drawtogether_36x36.png'
import type { PortfolioItem } from '../types'

export const drawTogether: PortfolioItem = {
  slug: 'drawtogether',
  name: 'DrawTogether',
  logo: drawTogetherLogo,
  roles: [
    {
      title: 'Real-time collaborative drawing platform',
      years: '',
      dates: '',
    },
  ],
  summary:
    'A real-time collaborative drawing application that allows multiple users to join shared rooms and draw together across devices.',
  tech: 'React · TypeScript · Node.js · Express · Socket.IO · Redis · Docker · AWS · Terraform · ECS Fargate · CloudFront · S3 · GitHub Actions',
  content: [
    {
      type: 'paragraph',
      text: 'The project started as a local full-stack application and was later expanded into an AWS deployment to learn how production-style applications are designed, deployed, secured, and operated in the cloud using Infrastructure-as-Code and automated CI/CD.',
    },
    {
      type: 'heading',
      text: 'Demo Video',
    },
    {
      type: 'paragraph',
      text: 'Coming soon.',
    },
    {
      type: 'heading',
      text: 'AWS Architecture Diagram',
    },
    {
      type: 'paragraph',
      text: 'Coming soon.',
    },
    {
      type: 'heading',
      text: 'Application Overview',
    },
    {
      type: 'paragraph',
      text: 'DrawTogether is built around a React frontend and a Node.js + Express backend connected through REST APIs and Socket.IO WebSockets for real-time communication.',
    },
    {
      type: 'paragraph',
      text: 'Users can create private rooms, join existing sessions using room codes, or enter a random matchmaking queue to draw together in real time. The application also includes live chat and stroke history replay, allowing users who join an existing room to see previous drawings.',
    },
    {
      type: 'paragraph',
      text: 'Rather than storing room state in application memory, shared state is stored in Redis (ElastiCache Valkey), making the architecture suitable for API horizontal scaling.',
    },
    {
      type: 'paragraph',
      text: 'Key features include:',
    },
    {
      type: 'bullets',
      items: [
        'Room-based collaborative drawing',
        'Random matchmaking',
        'Real-time canvas synchronization',
        'Integrated room chat',
        'Stroke history replay for late joiners',
      ],
    },
    {
      type: 'heading',
      text: 'AWS Infrastructure',
    },
    {
      type: 'paragraph',
      text: 'The application was migrated from a local Docker environment to AWS using Terraform, with the goal of learning Infrastructure-as-Code and production deployment practices.',
    },
    {
      type: 'paragraph',
      text: 'The infrastructure provisions:',
    },
    {
      type: 'bullets',
      items: [
        'Custom VPC with multi-AZ networking',
        'Application Load Balancer',
        'ECS Fargate for backend containers',
        'Amazon ECR for container images',
        'ElastiCache (Valkey) for shared application state',
        'Private S3 bucket for frontend hosting',
        'CloudFront CDN with Origin Access Control',
        'ACM-managed HTTPS certificates',
        'IAM roles following least-privilege principles',
      ],
    },
    {
      type: 'paragraph',
      text: 'Networking was designed using security-group isolation so traffic flows only through the intended layers (Internet → ALB → ECS → Redis).',
    },
    {
      type: 'heading',
      text: 'CI/CD & Deployment',
    },
    {
      type: 'paragraph',
      text: 'Deployment is fully automated using GitHub Actions and AWS OpenID Connect (OIDC), eliminating the need for long-lived AWS credentials.',
    },
    {
      type: 'paragraph',
      text: 'The deployment workflow:',
    },
    {
      type: 'bullets',
      items: [
        'Builds the React frontend and uploads the static assets to Amazon S3',
        'Invalidates the CloudFront cache to publish updates immediately',
        'Builds and tags the Node.js backend Docker image',
        'Pushes the image to Amazon ECR',
        'Triggers a new ECS Fargate deployment',
      ],
    },
    {
      type: 'paragraph',
      text: 'Terraform is used to provision and manage the entire infrastructure, making deployments reproducible and version controlled.',
    },
    {
      type: 'heading',
      text: 'Security & Cost Optimization',
    },
    {
      type: 'paragraph',
      text: 'The project emphasizes cloud security and operational best practices alongside deployment.',
    },
    {
      type: 'paragraph',
      text: 'Implemented practices include:',
    },
    {
      type: 'bullets',
      items: [
        'Least-privilege IAM roles',
        'HTTPS-only communication using ACM certificates',
        'Private S3 origins protected through CloudFront Origin Access Control',
        'Security-group isolation between infrastructure layers',
        'Terraform-managed infrastructure for reproducible environments',
      ],
    },
    {
      type: 'paragraph',
      text: 'To minimize AWS costs, the infrastructure is designed around Terraform apply / destroy workflows so I can destroy when not actively developing or doing a demo.',
    },
    {
      type: 'heading',
      text: 'Project Status',
    },
    {
      type: 'paragraph',
      text: `DrawTogether is an ongoing project that I use to practice cloud infrastructure and real-time application architecture. The current version focuses on establishing a production-style AWS deployment and deployment pipeline, and I will be adding more application features in the future.

To minimize AWS costs, the resources are destroyed when not actively developing or doing a demo.`,
    },
  ],
}
