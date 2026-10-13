import anotherTuesdayLogo from '../../assets/logos/anothertuesday_36x36.png'
import thumbnail from '../../assets/pictures/anothertuesday_thumbnail.png'
import trailerVideo from '../../assets/pictures/anothertuesday_trailer.mp4'
import type { PortfolioItem } from '../types'

export const anotherTuesday: PortfolioItem = {
  slug: 'anothertuesday',
  name: 'AnotherTuesday',
  logo: anotherTuesdayLogo,
  url: 'https://github.com/kallui/AnotherTuesday',
  roles: [
    {
      title: '2D pixel-art action game made at Global Game Jam 2024',
      years: '2024',
      dates: 'Jan 2024',
    },
  ],
  summary:
    'A 2D side-scrolling pixel-art game built in Unreal Engine over a weekend at Global Game Jam Vancouver 2024 with Team Big Dogs.',
  tech: 'Unreal Engine 5 · Blueprints · Paper2D',
  content: [
    {
      type: 'image',
      src: thumbnail,
      alt: 'AnotherTuesday title screen',
    },
    {
      type: 'paragraph',
      text: '[AnotherTuesday](https://github.com/kallui/AnotherTuesday) was built in a weekend at Global Game Jam Vancouver 2024 by Team Big Dogs, a team of six developers, artists, writers, and audio designers.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Trailer',
    },
    {
      type: 'video',
      src: trailerVideo,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Development',
    },
    {
      type: 'paragraph',
      text: 'I was the main developer on the team and owned all of the Unreal Engine code. The game is built in Unreal Engine 5 using Blueprints and Paper2D for sprite-based characters and tilemaps.',
    },
    {
      type: 'bullets',
      items: [
        'Player Character: Movement, jumping, and attacks wired up through Enhanced Input, with sprite animations for idle, walking, attacking, and getting hurt.',
        'Enemy AI: Behavior Trees and Blackboards for enemies that follow and attack the player, plus follow-only variants.',
        'Level & UI: Tilemap-based levels, an HP bar, a main menu, and a pause menu.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Controls',
    },
    {
      type: 'table',
      headers: ['Key', 'Action'],
      rows: [
        ['A / D', 'Move left and right'],
        ['Space', 'Jump'],
        ['Left Click', 'Attack'],
      ],
    },
    {
      type: 'link',
      url: 'https://globalgamejam.org/games/2024/another-tuesday-9',
      title: 'Another Tuesday',
      description: 'Global Game Jam 2024 game page',
    },
    {
      type: 'link',
      url: 'https://github.com/kallui/AnotherTuesday',
      title: 'kallui/AnotherTuesday',
      description: 'Source code and download instructions',
    },
  ],
}
