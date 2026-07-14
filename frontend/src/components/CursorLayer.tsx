import { useEffect, useRef } from 'react'
import { PixelArtAvatar } from './PixelArtAvatar'
import { usePresence } from '../context/PresenceContext'

/**
 * Listens to pointermove, sends normalized cursor coords, and renders
 * same-page peer cursors as floating labels. Mounted once in AppLayout.
 */
export function CursorLayer() {
  const { peers, cursors, sendCursor } = usePresence()
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // Touch-primary devices (phones/tablets) have imprecise pointers — skip
    // sending cursor positions entirely; they can still see others' cursors.
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: PointerEvent) => {
      pendingRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (pendingRef.current) {
          sendCursor(pendingRef.current.x, pendingRef.current.y)
          pendingRef.current = null
        }
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [sendCursor])

  if (cursors.length === 0) return null

  return (
    <div className="cursor-layer" aria-hidden="true">
      {cursors.map((cursor) => {
        const peer = peers.find((p) => p.id === cursor.id)
        const avatarSeed = peer?.avatarSeed ?? cursor.id
        return (
          <div
            key={cursor.id}
            className="peer-cursor"
            style={{
              transform: `translate(${cursor.x * 100}vw, ${cursor.y * 100}vh)`,
            }}
          >
            <svg
              className="peer-cursor-pointer"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Fat symmetric dart — tip top-left, wide wings (closer to reference) */}
              <path
                d="M1 1 L4.2 17.5 L7.6 7.6 L17.5 4.2 Z"
                fill={cursor.color}
                stroke="#fff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="peer-cursor-label"
              style={{
                background: cursor.color,
              }}
            >
              <PixelArtAvatar
                className="peer-cursor-avatar"
                seed={avatarSeed}
              />
              <span className="peer-cursor-name">{cursor.displayName}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
