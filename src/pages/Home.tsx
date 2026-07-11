import { WorkList } from '../components/WorkList'
import { work, industryWork, projects } from '../content'

export function Home() {
  return (
    <main>
      <header>
        <h1>Nicholas Januar</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
          <a href="#">Example link</a>.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
          <a href="#">Example link</a>. TODO WHERE TO ADD ABOUT DEVOPS interest
        </p>
      </header>

      <section>
        <h2>Work</h2>
        <WorkList items={work} basePath="/work" />
      </section>

      <section>
        <h2>Industry Project</h2>
        <WorkList items={industryWork} basePath="/industry" />
      </section>

      <section>
        <h2>My Projects</h2>
        <WorkList items={projects} basePath="/projects" />
      </section>
    </main>
  )
}
