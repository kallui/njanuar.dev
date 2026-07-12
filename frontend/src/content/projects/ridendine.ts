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
  content: [
    {
      type: 'image',
      src: webOverall,
      alt: 'RideNDine overall app screenshot',
    },
    {
      type: 'paragraph',
      text: '[www.ridendine.app](https://ridendine.app)',
    },
    {
      type: 'heading',
      text: 'The Problem',
    },
    {
      type: 'paragraph',
      text: `[RideNDine](https://ridendine.app) started from my own commute.

When I started working in a different city, I found myself spending hours on public transit every day without knowing what food options were available along the way. After work, I often wanted to grab dinner on my trip home, but finding places that fit naturally into my route meant jumping between transit stops and restaurant searches.

Google Maps already makes it easy for drivers to discover restaurants along their route. For public transit riders, however, finding convenient food stops often means checking stations and nearby restaurants one by one. I built RideNDine to make those discoveries easier.`,
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
      type: 'heading',
      text: 'Metro Vancouver',
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
      text: 'Tech Stack',
    },
    {
      type: 'bullets',
      items: [
        'Built with React, TypeScript, and Next.js.',
        'Uses the Google Maps and Places APIs for routing and restaurant discovery.',
        'Uses TransLink GTFS data to map restaurants to real transit stops in Metro Vancouver.',
        'Falls back to route sampling for regions outside Metro Vancouver.',
        'Deployed on Vercel with serverless APIs.',
        'Implements caching and rate limiting to keep API usage sustainable.',
      ],
    },
    {
      type: 'heading',
      text: 'Usage Limits',
    },
    {
      type: 'paragraph',
      text: 'RideNDine currently allows up to 5 route searches within any rolling 24-hour period to help keep the project sustainable.',
    },
  ],
}
