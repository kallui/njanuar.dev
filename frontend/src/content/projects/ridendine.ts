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
    'A web app that finds restaurants along your public transit route, so you can grab food without leaving your commute.',
  tech: 'React · TypeScript · Next.js · Google Maps · Places API · TransLink GTFS · Vercel',
  content: [
    {
      type: 'paragraph',
      text: `[RideNDine](https://ridendine.app) started from my own commute. Spending hours on transit each day, I often wanted dinner on the way home — but finding food that fit my route meant checking stops and restaurants one by one.

Google Maps and Apple Maps make this easy for drivers. For transit riders, it doesn't. I built RideNDine to close that gap.`,
    },
    {
      type: 'image',
      src: webOverall,
      alt: 'RideNDine overall app screenshot',
    },
    {
      type: 'heading',
      text: 'How It Works',
    },
    {
      type: 'bullets',
      items: [
        'Enter your route — Choose a starting point and destination.',
        'Pick your route — Select the transit option that best fits your trip.',
        'Explore food options — RideNDine finds restaurants within walking distance of your journey.',
        'Continue your trip — Open any restaurant directly in your preferred maps app for navigation.',
      ],
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
      text: 'Coverage',
    },
    {
      type: 'paragraph',
      text: 'Within Metro Vancouver, RideNDine uses TransLink GTFS data to search real bus stops and train stations along your route. Restaurants are linked to actual transit stops, making it easier to see where to get off and grab food.',
    },
    {
      type: 'paragraph',
      text: `Elsewhere, RideNDine samples points along the transit path at regular intervals to find nearby restaurants. While results are less stop-specific, the app still supports restaurant discovery along transit routes.

Support for additional transit systems is planned.`,
    },
    {
      type: 'heading',
      text: 'Usage Limits',
    },
    {
      type: 'paragraph',
      text: 'RideNDine currently allows up to 5 route searches within any rolling 24-hour period to help keep the project sustainable. Caching and rate limiting help keep API usage sustainable.',
    },
  ],
}
