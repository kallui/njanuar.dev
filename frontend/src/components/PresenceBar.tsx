import { useEffect, useRef, useState } from 'react'
import { PixelArtAvatar } from './PixelArtAvatar'
import { useGuest } from '../context/GuestContext'
import {
  PRESENCE_UI_LIMIT,
  usePresence,
  type PresencePeer,
} from '../context/PresenceContext'

const COLLAPSE_DELAY_MS = 900

/** Site-wide presence stack: you + live peers from the WebSocket hub. */
export function PresenceBar() {
  const { guest, currentPage } = useGuest()
  const { peers: livePeers, status } = usePresence()
  const [expanded, setExpanded] = useState(false)
  const collapseTimerRef = useRef<number | null>(null)

  // Toggle mock crowd for UI testing (25 fake peers → shows +N).
  const USE_MOCK_PRESENCE = false
  const peers: PresencePeer[] = USE_MOCK_PRESENCE
    ? Array.from({ length: 10 }, (_, i) => ({
        id: `mock-${i}`,
        displayName: `guest-${i}`,
        avatarSeed: `seed-${i}`,
        color: ['#E85D4C', '#3B82F6', '#22A06B', '#D97706'][i % 4]!,
        page: i % 2 === 0 ? '/' : '/doodle',
        cursorOk: true,
      }))
    : livePeers

  // Always show you + up to (LIMIT - 1) peers ≈ LIMIT faces, then +N.
  const peerSlots = Math.max(0, PRESENCE_UI_LIMIT - 1)
  const visiblePeers = peers.slice(0, peerSlots)
  const overflow = Math.max(0, peers.length - visiblePeers.length)

  // Leftmost sits on top of the stack; +N sits under everyone.
  const topZ = visiblePeers.length + 1

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current)
      }
    }
  }, [])

  const expand = () => {
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = null
    }
    setExpanded(true)
  }

  const scheduleCollapse = () => {
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current)
    }
    collapseTimerRef.current = window.setTimeout(() => {
      setExpanded(false)
      collapseTimerRef.current = null
    }, COLLAPSE_DELAY_MS)
  }

  return (
    <div className="presence-bar" aria-label="Who's here" data-status={status}>
      <ul
        className={`presence-stack${expanded ? ' is-expanded' : ''}`}
        onPointerEnter={expand}
        onPointerLeave={scheduleCollapse}
        onPointerDown={expand}
        onPointerUp={(e) => {
          // Mobile: collapse after a delay once the finger lifts.
          // Mouse keeps expanded until the pointer leaves the stack.
          if (e.pointerType !== 'mouse') scheduleCollapse()
        }}
        onPointerCancel={scheduleCollapse}
      >
        <li style={{ zIndex: topZ }}>
          <span
            className="presence-avatar presence-avatar--self has-tooltip has-tooltip--below"
            data-tooltip={`${guest.displayName} (You) · ${currentPage}`}
            aria-label={`You are ${guest.displayName} on ${currentPage}`}
            style={{
              boxShadow: `0 0 0 2px color-mix(in srgb, ${guest.color} 70%, transparent)`,
            }}
          >
            <PixelArtAvatar
              className="presence-avatar-face"
              seed={guest.avatarSeed}
            />
          </span>
        </li>
        {visiblePeers.map((peer, i) => (
          <li key={peer.id} style={{ zIndex: topZ - 1 - i }}>
            <span
              className="presence-avatar has-tooltip has-tooltip--below"
              data-tooltip={`${peer.displayName} · ${peer.page}`}
              aria-label={`${peer.displayName} on ${peer.page}`}
              style={{
                boxShadow: `0 0 0 2px color-mix(in srgb, ${peer.color} 70%, transparent)`,
              }}
            >
              <PixelArtAvatar
                className="presence-avatar-face"
                seed={peer.avatarSeed}
              />
            </span>
          </li>
        ))}
        {overflow > 0 && (
          <li className="presence-overflow-item" style={{ zIndex: 0 }}>
            <span
              className="presence-overflow has-tooltip has-tooltip--below"
              data-tooltip={`${overflow} more online`}
              aria-label={`${overflow} more online`}
            >
              +{overflow}
            </span>
          </li>
        )}
      </ul>
    </div>
  )
}
