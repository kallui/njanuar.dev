---
slug: visto
name: Visto
url: https://github.com/kallui/Visto
roles:
  - title: Turn written stories into visual novel games
    years: "2023"
    dates: Jan 2023
summary: A project built at nwHacks 2023 that converts written stories into interactive visual novels, with AI-generated artwork and background music matched to the mood of each scene.
tech: Python · FastAPI · GPT-3 · Stable Diffusion · Ren'Py
---

[Visto](https://github.com/kallui/Visto) takes a story as a PDF or raw text and turns it into a playable visual novel game, complete with character art, scene backgrounds, and music.

## Features

- Story Conversion: GPT-3 extracts the key story elements, including characters, physical descriptions, dialogue, and the mood of each scene.
- Custom Artwork: Stable Diffusion generates artwork for each character and scene background in a style reminiscent of Studio Ghibli.
- Mood-Based Music: Each scene gets background music that matches its mood, such as upbeat music for happy scenes or tense music for suspenseful ones.
- Interactive Visual Novel: The extracted story data is compiled into a visual novel game using the Ren'Py Python engine.

## Preview: Little Red Riding Hood

Input: the text of [Little Red Riding Hood](https://americanliterature.com/childrens-stories/little-red-riding-hood). Output:

![Visto generated scene of a forest cottage](../../assets/pictures/visto_1.jpg)

![Visto generated scene](../../assets/pictures/visto_2.jpg)

![Visto generated scene](../../assets/pictures/visto_3.jpg)

@[kallui/Visto](https://github.com/kallui/Visto "nwHacks 2023 project: converts written stories into engaging visual experiences")
