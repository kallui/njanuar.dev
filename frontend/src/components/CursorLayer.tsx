import { useEffect, useRef } from 'react'
import { PixelArtAvatar } from './PixelArtAvatar'
import { usePresence } from '../context/PresenceContext'

/**
 * Listens to pointermove, sends normalized cursor coords, and renders
 * same-page peer cursors as floating labels. Mounted once in AppLayout.
 *
 * Touch-primary devices only broadcast while a finger is down; idle
 * cleanup (same 3s as desktop) removes the cursor after they stop.
 */
export function CursorLayer() {
  const { peers, cursors, sendCursor } = usePresence()
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let touching = false

    const queue = (e: PointerEvent) => {
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

    const onMove = (e: PointerEvent) => {
      if (coarse && !touching) return
      queue(e)
    }

    const onDown = (e: PointerEvent) => {
      if (!coarse) return
      if (e.pointerType === 'mouse') return
      touching = true
      queue(e)
    }

    const onUp = (e: PointerEvent) => {
      if (!coarse || !touching) return
      if (e.pointerType === 'mouse') return
      touching = false
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    if (coarse) {
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
      window.addEventListener('pointercancel', onUp, { passive: true })
    }
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (coarse) {
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }
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
