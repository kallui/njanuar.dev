import genxysLogo from '../../assets/logos/genxys_36x36.jpg'
import type { PortfolioItem } from '../types'

export const genxys: PortfolioItem = {
  slug: 'genxys',
  name: 'GenXys',
  logo: genxysLogo,
  url: 'https://www.genxys.com',
  roles: [
    {
      title: 'Bioinformatics & Implementation Support Co-op',
      years: 'Mar - Aug 2024',
    },
  ],
  content: [
    {
      type: 'paragraph',
      text: 'I worked with the Bioinformatics team at [GenXys](https://www.genxys.com), a healthcare technology company focused on using clinical and genetic data to support personalized prescribing decisions. My role focused on processing and validating patient pharmacogenetic data, while creating solutions to automate manual workflows and improve client integrations.',
    },
    {
      type: 'heading',
      text: 'Pharmacogenetic Data Processing',
    },
    {
      type: 'paragraph',
      text: 'One of my main projects was automating the process of analyzing and mapping patient pharmacogenetic data. Before this, the process of validating and mapping patient data was mostly done manually, which was time-consuming and difficult to scale. I built Python scripts using Pandas to automate this workflow and process pharmacogenetic data before it was integrated into the GenXys platform. Since different clients could provide data in different formats, I regularly updated, tested, and maintained the scripts to handle new requirements and ensure data was processed correctly. I also created a GitHub repository to organize the scripts and allow collaboration with the team.',
    },
    {
      type: 'heading',
      text: 'Testing, Validation & Data Access',
    },
    {
      type: 'paragraph',
      text: 'I also built scripts to automate testing and validation of the star allele and phenotype mapping systems using patient sample data, which significantly reduced manual testing effort. I also created an SOP documenting the validation process to ensure repeatable workflows. Additionally, I created scripts to help retrieve information from public health databases through APIs, allowing the clinical algorithm team access data without having to manually search for it.',
    },
    {
      type: 'heading',
      text: 'Client Data Formatting App',
    },
    {
      type: 'paragraph',
      text: 'I also built a desktop application to help clients who struggled with manually formatting their data by automatically converting files into the required format.',
    },
    { type: 'divider' },
    {
      type: 'heading',
      text: 'TL;DR',
    },
    {
      type: 'bullets',
      items: [
        'Automated pharmacogenetic data processing and mapping workflows.',
        'Built testing and validation scripts, reducing manual effort by 80%.',
        'Created a central repository to manage scripts and allow team collaboration.',
        'Created a desktop application to help clients easily format data.',
      ],
    },
  ],
}
