import { Link } from 'react-router-dom'

export function DevOpsPage() {
  return (
    <main>
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <header className="detail-header">
        <div className="detail-title">
          <h1>DevOps</h1>
        </div>
      </header>

      <p className="detail-summary">
        A place to document my DevOps and cloud learning journey - the projects
        I build and the things I pick up along the way.
      </p>

      <section>
        <h2>Projects</h2>

        <h3 className="devops-project-title">
          njanuar.dev - Production infrastructure
        </h3>
        <ul className="detail-bullets">
          <li>
            <strong>
              Deployed and operated a full-stack portfolio application on a
              DigitalOcean Linux VPS
            </strong>{' '}
            using an Nginx reverse proxy, Let's Encrypt TLS, Cloudflare DNS, and
            systemd service management.
          </li>
          <li>
            <strong>Built GitHub Actions CI/CD pipelines</strong> to automate
            React frontend builds, Go backend deployment, and remote server
            updates over SSH and rsync.
          </li>
          <li>
            <strong>Configured application infrastructure</strong> including
            WebSocket (<code>wss://</code>) proxying, rate limiting (
            <code>limit_req</code>), environment management, and Linux service
            administration.
          </li>
        </ul>
        <p className="devops-tech">
          DigitalOcean · Nginx · Let's Encrypt · Cloudflare · systemd · GitHub
          Actions · Go · SSH · Bash
        </p>
      </section>

      <section>
        <h2>Scripts & tooling</h2>

        <h3 className="devops-project-title">
          Linux Server Monitoring Toolkit
        </h3>
        <p>
          A Bash tool for analyzing Linux server performance from the command
          line - reports CPU, memory, and disk utilization and surfaces the top
          processes by resource consumption using standard Linux utilities.
        </p>
        <p className="devops-tech">Bash · Linux · top · ps · free · df · awk</p>

        <h3 className="devops-project-title">Nginx Access Log Analyzer</h3>
        <p>
          A command-line tool that parses Nginx access logs into operational
          insights - most active IPs, most-requested endpoints, HTTP status
          codes, and user agents - using common Unix text-processing utilities.
        </p>
        <p className="devops-tech">
          Bash · Linux · Nginx · awk · sort · uniq · grep
        </p>
      </section>
    </main>
  )
}
