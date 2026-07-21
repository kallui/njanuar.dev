import kayoLogo from '../../assets/logos/kayo_36x36.png'
import demoVideo from '../../assets/pictures/kayo_demo.mp4'
import type { PortfolioItem } from '../types'

export const kayo: PortfolioItem = {
  slug: 'kayo',
  name: 'KAY/O',
  logo: kayoLogo,
  url: 'https://github.com/kallui/kayo',
  roles: [
    {
      title:
        'Watch your belongings using object detection and real-time alerts',
      years: '2024',
      dates: 'Jan 2024',
    },
  ],
  summary:
    'NwHacks 2024 Hackathon Honorable Mention (2nd Place) Winning Project',
  content: [
    {
      type: 'video',
      src: demoVideo,
    },
    {
      type: 'paragraph',
      text: 'Leaving your stuff unattended at a cafe or library? [KAY/O](https://github.com/kallui/kayo) watches it for you using just your laptop camera and object recognition to alert you if anything goes missing.',
    },
    {
      type: 'heading',
      text: 'Features',
    },
    {
      type: 'bullets',
      items: [
        'Object Recognition: KAY/O uses YOLOv8 for object recognition to track your belongings.',
        'Crash Detection: The system includes a crash detection server to avoid thieves closing the application, or shutting down the laptop.',
        'Alerts via Twilio: Set up Twilio environment variables to receive text alerts straight to your phone.',
      ],
    },
    {
      type: 'link',
      url: 'https://github.com/kallui/kayo',
      title: 'kallui/kayo',
      description:
        'nwHacks 2024 Hackathon Honorable Mention (2nd Place) Winning Project',
    },
  ],
}
