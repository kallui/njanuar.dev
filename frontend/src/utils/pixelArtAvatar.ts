import { Avatar, Style } from '@dicebear/core'
import definition from '@dicebear/styles/pixel-art.json' with { type: 'json' }

const style = new Style(definition)

export function pixelArtAvatarSvg(seed: string) {
  return new Avatar(style, { seed }).toString()
}
