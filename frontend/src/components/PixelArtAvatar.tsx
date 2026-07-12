import { useMemo } from 'react'
import { pixelArtAvatarSvg } from '../utils/pixelArtAvatar'

type PixelArtAvatarProps = {
  seed: string
  className?: string
}

export function PixelArtAvatar({ seed, className }: PixelArtAvatarProps) {
  const svg = useMemo(() => pixelArtAvatarSvg(seed), [seed])

  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
