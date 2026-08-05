import bashLogo from '../../assets/logos/bash_36x36.svg'
import type { PortfolioItem } from '../types'

export const bashScripts: PortfolioItem = {
  slug: 'bash-scripts',
  name: 'Bash/Linux Scripts',
  logo: bashLogo,
  roles: [
    {
      title: 'Scripts & tooling',
      years: '',
      dates: '',
    },
  ],
  summary:
    'Command-line Bash tools for Linux server monitoring and Nginx access log analysis.',
  content: [
    {
      type: 'heading',
      text: 'Linux Server Monitoring Toolkit',
    },
    {
      type: 'paragraph',
      text: 'A Bash tool for analyzing Linux server performance from the command line - reports CPU, memory, and disk utilization and surfaces the top processes by resource consumption using standard Linux utilities.',
    },
    {
      type: 'paragraph',
      text: 'Bash · Linux · top · ps · free · df · awk',
    },
    {
      type: 'heading',
      text: 'Nginx Access Log Analyzer',
    },
    {
      type: 'paragraph',
      text: 'A command-line tool that parses Nginx access logs into operational insights - most active IPs, most-requested endpoints, HTTP status codes, and user agents - using common Unix text-processing utilities.',
    },
    {
      type: 'paragraph',
      text: 'Bash · Linux · Nginx · awk · sort · uniq · grep',
    },
  ],
}
