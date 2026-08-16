import njanuarLogo from '../../assets/logos/njanuar_36x36.svg'
import type { PortfolioItem } from '../types'

export const portfolioInfra: PortfolioItem = {
  slug: 'portfolio-infra',
  name: 'Portfolio Cloud Infrastructure',
  logo: njanuarLogo,
  roles: [
    {
      title: 'njanuar.dev production infrastructure',
      years: 'Present',
      dates: '',
    },
  ],
  summary:
    'Built and operated the infrastructure behind my personal portfolio, deploying a full-stack application on a Linux VPS hosted on DigitalOcean. The project focuses on Linux system administration, production deployment, reverse proxy configuration, automation, and secure hosting.',
  tech: "DigitalOcean · Linux · Nginx · Let's Encrypt · Cloudflare · systemd · GitHub Actions · Go · React · Vite · SSH · Bash",
  content: [
    {
      type: 'heading',
      level: 2,
      text: 'Linux Server & Infrastructure',
    },
    {
      type: 'bullets',
      items: [
        'Provisioned and administered a Linux VPS on DigitalOcean to host a full-stack portfolio application.',
        'Organized the production environment using standard Linux conventions, including /var/www, /opt, dedicated service accounts, environment files, and file ownership policies.',
        'Managed Linux users, SSH authentication, deployment keys, file permissions, and environment configuration for secure production deployments.',
        'Created and managed a systemd service (njanuar-api.service) to ensure the Go backend automatically starts, restarts on failure, and runs as a background service.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Networking & Web Server',
    },
    {
      type: 'bullets',
      items: [
        'Configured Nginx as a reverse proxy to serve the React/Vite frontend, route API requests to the Go backend, and proxy WebSocket connections for real-time presence.',
        "Secured the application with HTTPS using Let's Encrypt, including automated certificate issuance and renewal for both HTTPS and secure wss:// WebSocket traffic.",
        'Configured DNS through Cloudflare (DNS-only) to manage domain routing and TLS integration.',
        'Implemented request rate limiting, connection controls, and long-lived WebSocket proxy settings within Nginx to improve reliability and protect against abusive traffic.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'CI/CD & Deployment',
    },
    {
      type: 'bullets',
      items: [
        'Designed GitHub Actions CI/CD pipelines to automate frontend and backend deployments over SSH using rsync, including remote service restarts after successful deployments.',
        'Built Linux binaries for the Go backend during CI before deploying them to the production server.',
        'Automated repeatable deployments while maintaining secure access through SSH keys and deployment credentials.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Architecture',
    },
    {
      type: 'paragraph',
      text: 'The application follows a simple production architecture:',
    },
    {
      type: 'pre',
      text: `Browser
    │
  HTTPS
    │
Cloudflare DNS
    │
Nginx Reverse Proxy
 ┌──┴───────────────┐
 │                  │
React Frontend   Go REST API + WebSocket
                     │
          Persistent PNG + JSON Storage`,
    },
    {
      type: 'paragraph',
      text: 'The backend combines REST APIs with a WebSocket hub for real-time communication while storing uploaded doodles as PNG files alongside a JSON index on disk.',
    },
  ],
}
