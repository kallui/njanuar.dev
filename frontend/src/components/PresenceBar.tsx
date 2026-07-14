import { PixelArtAvatar } from './PixelArtAvatar'
import { useGuest } from '../context/GuestContext'

/** Site-wide presence chrome. Phase 3: show local guest only; roster comes in Phase 5. */
export function PresenceBar() {
  const { guest, currentPage } = useGuest()

  return (
    <div className="presence-bar" aria-label="Who's here">
      <ul className="presence-stack">
        <li>
          <span
            className="presence-avatar has-tooltip has-tooltip--below"
            data-tooltip={`${guest.displayName} (You) · ${currentPage}`}
            aria-label={`You are ${guest.displayName} on ${currentPage}`}
            style={{ boxShadow: `0 0 0 2px ${guest.color}` }}
          >
            <PixelArtAvatar
              className="presence-avatar-face"
              seed={guest.avatarSeed}
            />
          </span>
        </li>
      </ul>
    </div>
  )
}
