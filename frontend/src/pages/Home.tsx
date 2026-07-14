import { Link } from 'react-router-dom'
import { WorkList } from '../components/WorkList'
import { VancouverClock } from '../components/VancouverClock'
import { work, industryWork, projects } from '../content'
import kikiLogo from '../assets/pictures/kiki_logo.svg'

export function Home() {
  return (
    <main>
      <header>
        <div className="home-title">
          <img className="home-logo" src={kikiLogo} alt="" />
          <VancouverClock />
        </div>
        <h1>Nicholas Januar</h1>
        <p>
          Hi, you can call me Niko. I enjoy building softwares to solve problems
          I run into.
        </p>
      </header>

      <section>
        <h2>Industry Project</h2>
        <WorkList items={industryWork} basePath="/industry" />
      </section>

      <section>
        <h2>Work</h2>
        <WorkList items={work} basePath="/work" />
      </section>

      <section>
        <h2>Featured Projects</h2>
        <WorkList items={projects} basePath="/projects" />
      </section>

      <section>
        <h2>Current rabbit hole</h2>
        <p>
          Currently exploring DevOps and cloud. Setting up Linux servers,
          writing bash scripts, building CI/CD pipelines, and container
          orchestration.
        </p>
      </section>

      <section>
        <h2>Doodle</h2>
        <p>
          You've seen my little corner of the internet.
          <br />
          Now leave a little piece of yours.
        </p>
        <Link to="/doodle" className="doodle-cta">
          Leave a doodle
        </Link>
      </section>
    </main>
  )
}
