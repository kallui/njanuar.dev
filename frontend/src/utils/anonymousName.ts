const adjectives = [
  'little',
  'sleepy',
  'curious',
  'quiet',
  'sunny',
  'cozy',
  'brave',
  'gentle',
  'fuzzy',
  'swift',
]

const animals = [
  'elephant',
  'fox',
  'otter',
  'panda',
  'sparrow',
  'koala',
  'penguin',
  'hedgehog',
  'raccoon',
  'bunny',
]

export function generateAnonymousName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  const number = Math.floor(Math.random() * 90) + 10
  return `${adjective}-${animal}${number}`
}
