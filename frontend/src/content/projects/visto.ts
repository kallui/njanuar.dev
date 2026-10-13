import visto1 from '../../assets/pictures/visto_1.jpg'
import visto2 from '../../assets/pictures/visto_2.jpg'
import visto3 from '../../assets/pictures/visto_3.jpg'
import type { PortfolioItem } from '../types'

export const visto: PortfolioItem = {
  slug: 'visto',
  name: 'Visto',
  url: 'https://github.com/kallui/Visto',
  roles: [
    {
      title: 'Turn written stories into visual novel games',
      years: '2023',
      dates: 'Jan 2023',
    },
  ],
  summary:
    'A project built at nwHacks 2023 that converts written stories into interactive visual novels, with AI-generated artwork and background music matched to the mood of each scene.',
  tech: "Python · FastAPI · GPT-3 · Stable Diffusion · Ren'Py",
  content: [
    {
      type: 'paragraph',
      text: '[Visto](https://github.com/kallui/Visto) takes a story as a PDF or raw text and turns it into a playable visual novel game, complete with character art, scene backgrounds, and music.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Features',
    },
    {
      type: 'bullets',
      items: [
        'Story Conversion: GPT-3 extracts the key story elements, including characters, physical descriptions, dialogue, and the mood of each scene.',
        'Custom Artwork: Stable Diffusion generates artwork for each character and scene background in a style reminiscent of Studio Ghibli.',
        'Mood-Based Music: Each scene gets background music that matches its mood, such as upbeat music for happy scenes or tense music for suspenseful ones.',
        "Interactive Visual Novel: The extracted story data is compiled into a visual novel game using the Ren'Py Python engine.",
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Preview: Little Red Riding Hood',
    },
    {
      type: 'paragraph',
      text: 'Input: the text of [Little Red Riding Hood](https://americanliterature.com/childrens-stories/little-red-riding-hood). Output:',
    },
    {
      type: 'image',
      src: visto1,
      alt: 'Visto generated scene of a forest cottage',
    },
    {
      type: 'image',
      src: visto2,
      alt: 'Visto generated scene',
    },
    {
      type: 'image',
      src: visto3,
      alt: 'Visto generated scene',
    },
    {
      type: 'link',
      url: 'https://github.com/kallui/Visto',
      title: 'kallui/Visto',
      description:
        'nwHacks 2023 project: converts written stories into engaging visual experiences',
    },
  ],
}
