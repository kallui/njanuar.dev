import ridendineLogo from '../../assets/logos/ridendine_36x36.png'
import webOverall from '../../assets/pictures/ridendine_web_overall.png'
import mainMenu from '../../assets/pictures/ridendine_mobile_mainmenu.png'
import routeOptions from '../../assets/pictures/ridendine_mobile_routeoptions.png'
import restaurantList from '../../assets/pictures/ridendine_mobile_restaurantlistexpanded.png'
import restaurantDetails from '../../assets/pictures/ridendine_mobile_restaurantdetails.png'
import type { PortfolioItem } from '../types'

export const ridendine: PortfolioItem = {
  slug: 'ridendine',
  name: 'RideNDine',
  logo: ridendineLogo,
  url: 'https://ridendine.app',
  roles: [
    {
      title: 'Find food options along your transit route',
      years: 'Present',
      dates: 'Jan 2026 - Present',
    },
  ],
  summary:
    'A full-stack application that helps transit commuters discover restaurants along their routes.',
  tech: 'React · TypeScript · Next.js · Google Maps · Places API · TransLink GTFS · AWS · Terraform · GitHub Actions',
  content: [
    {
      type: 'paragraph',
      text: '[Try RideNDine →](https://ridendine.app)',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Overview',
    },
    {
      type: 'paragraph',
      text: `RideNDine started from my own commute. Spending hours on transit each day, I often wanted dinner on the way home, but finding food that fit my route meant checking stops and restaurants one by one.

Google Maps and Apple Maps make this easy for drivers. For transit riders, it doesn't. I built RideNDine to close that gap.

The application takes a user's origin and destination, determines their public transit route, and finds restaurants along the journey that are within walking distance of transit stops or points along the route.`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'How It Works',
    },
    {
      type: 'heading',
      level: 3,
      text: '1. Enter your route',
    },
    {
      type: 'paragraph',
      text: 'Choose a starting point and destination.',
    },
    {
      type: 'heading',
      level: 3,
      text: '2. Choose a transit route',
    },
    {
      type: 'paragraph',
      text: 'RideNDine uses public transit data to determine the stops and path associated with the selected route.',
    },
    {
      type: 'heading',
      level: 3,
      text: '3. Find restaurants along the way',
    },
    {
      type: 'paragraph',
      text: 'The application searches for restaurants near the transit journey and ranks them based on their proximity to the route.',
    },
    {
      type: 'heading',
      level: 3,
      text: '4. Continue your trip',
    },
    {
      type: 'paragraph',
      text: 'Open a restaurant directly in your preferred maps application for navigation.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Screenshots',
    },
    {
      type: 'paragraph',
      text: 'RideNDine is available on both web and mobile. On mobile, it is set up as a PWA, so you can add it to your home screen and use it like a native app.',
    },
    { type: 'divider' },
    {
      type: 'image',
      src: webOverall,
      alt: 'RideNDine overall app screenshot',
    },
    {
      type: 'gallery',
      images: [
        {
          src: mainMenu,
          alt: 'RideNDine main menu',
          caption: 'Main menu',
        },
        {
          src: routeOptions,
          alt: 'RideNDine route options',
          caption: 'Route options',
        },
        {
          src: restaurantList,
          alt: 'RideNDine restaurant list',
          caption: 'Restaurants list',
        },
        {
          src: restaurantDetails,
          alt: 'RideNDine restaurant details',
          caption: 'Restaurant detail',
        },
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Migrating from Vercel to AWS',
    },
    {
      type: 'paragraph',
      text: `As RideNDine grew to support more cities, the original serverless architecture became increasingly restrictive.

The application processes large transit datasets, and some of that processing required more memory and execution time than was practical within the serverless environment. I decided to move the application to a dedicated AWS environment to have more control over compute resources and how data processing was handled.

The migration moved RideNDine from Vercel to an AWS Lightsail production server running Ubuntu, with Nginx handling the web server and reverse proxy layer.`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Infrastructure',
    },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['AWS Lightsail', 'Application server'],
        ['Ubuntu Linux', 'OS'],
        ['Nginx', 'Reverse proxy and web server'],
        ['S3', 'Storage for GTFS data'],
        ['Docker', 'Redis container'],
        ['Terraform', 'IaC'],
        ['GitHub Actions', 'CI/CD and scheduled data processing'],
        ['IAM + OIDC', 'GitHub Actions and Lightsail authentication'],
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Moving Heavy Processing Out of Production Server',
    },
    {
      type: 'paragraph',
      text: `One of the main challenges was the server's 2 GB RAM limit.

The weekly transit data processing job was memory-intensive enough that running it directly on the production server could cause out-of-memory failures. Instead of upgrading the server, I moved the heavy processing into GitHub Actions.

The workflow now looks like:`,
    },
    {
      type: 'pre',
      text: 'GitHub Actions → Process data → S3 → Production server',
    },
    {
      type: 'paragraph',
      text: `GitHub Actions processes the data and uploads the completed artifacts to a private S3 bucket. The production server only needs to download and serve the processed data.

This keeps resource-intensive workloads out of the production environment and allows the application to continue running on a relatively small instance.`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'AWS Security & CI/CD',
    },
    {
      type: 'paragraph',
      text: `I also redesigned the deployment workflow around GitHub Actions OIDC and least-privilege IAM.

GitHub Actions can publish processed artifacts to S3, while the production server only has permission to read from the bucket.

This means the CI pipeline does not require long-lived AWS credentials, and the production server cannot modify or delete the stored artifacts.`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Deployment Flow',
    },
    {
      type: 'pre',
      text: `GitHub Actions
      │
      │ OIDC authentication
      ▼
   AWS IAM
      │
      │ write
      ▼
 Private S3
      │
      │ read
      ▼
AWS Lightsail
      │
      ▼
   RideNDine`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Optimizing Performance Within 2 GB RAM',
    },
    {
      type: 'paragraph',
      text: `Moving the processing workload off the server solved the biggest memory problem, but the application still needed to efficiently serve transit data from a relatively small 2 GB instance.

To evaluate worst-case performance, I created a benchmark simulating simultaneous requests for different cities' transit data. The initial benchmark showed that a request requiring a city whose data was not already loaded could take ~17 seconds under this worst-case scenario.

I optimized the data-loading architecture by pre-caching processed GTFS data on disk and using LRU caching and concurrency limits, reducing the worst-case data-loading latency to ~45ms while staying within the server's memory constraints.`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Result',
    },
    {
      type: 'paragraph',
      text: `~17s → ~45ms

Data-loading latency under simulated worst-case load`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Expanding to More Cities',
    },
    {
      type: 'paragraph',
      text: `RideNDine originally focused on Metro Vancouver, using TransLink's GTFS data to find real bus stops, SkyTrain stations, SeaBus terminals, and other transit services along a user's route.

The underlying transit-data architecture has since been expanded to support additional cities.`,
    },
    {
      type: 'heading',
      level: 3,
      text: 'Current Transit Coverage',
    },
    {
      type: 'table',
      headers: ['City', 'Country', 'Transit data'],
      rows: [
        ['Metro Vancouver', 'Canada', 'TransLink'],
        ['Toronto', 'Canada', 'TTC + GO Transit'],
        ['Montréal', 'Canada', 'STM + REM'],
        [
          'Seattle / Puget Sound',
          'United States',
          'Sound Transit + King County Metro',
        ],
        ['Portland', 'United States', 'TriMet'],
        ['Chicago', 'United States', 'CTA + Pace'],
        ['Greater Boston', 'United States', 'MBTA'],
        ['Denver', 'United States', 'RTD'],
        ['Austin', 'United States', 'CapMetro'],
      ],
    },
    {
      type: 'paragraph',
      text: 'RideNDine currently supports transit data from 9 metropolitan areas, with additional transit systems planned.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Usage Limits',
    },
    {
      type: 'paragraph',
      text: `RideNDine currently allows up to 5 route searches within any rolling 24-hour period to help keep the project sustainable.

Caching, rate limiting, and server-side data processing help reduce unnecessary API usage and infrastructure costs.`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Technical Architecture',
    },
    {
      type: 'heading',
      level: 3,
      text: 'Frontend',
    },
    {
      type: 'bullets',
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Backend & Data',
    },
    {
      type: 'bullets',
      items: [
        'Next.js server-side functionality',
        'Google Maps / Places APIs',
        'GTFS transit data',
        'Redis',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Infrastructure',
    },
    {
      type: 'bullets',
      items: [
        'AWS Lightsail',
        'Amazon S3',
        'Docker',
        'Nginx',
        'Terraform',
        'GitHub Actions',
        'AWS IAM / OIDC',
        'Ubuntu Linux',
      ],
    },
  ],
}
