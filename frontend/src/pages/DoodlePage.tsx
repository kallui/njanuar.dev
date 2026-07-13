import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  DoodleCanvas,
  type DoodleCanvasHandle,
} from '../components/DoodleCanvas'
import { PixelArtAvatar } from '../components/PixelArtAvatar'
import {
  loadOrCreateGuest,
  MAX_DISPLAY_NAME_LENGTH,
  shuffleGuestAvatar,
  updateGuestName,
} from '../utils/guest'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const ADMIN_SECRET_KEY = 'doodle-admin-secret'
const ADMIN_AUTO_CONFIRM_KEY = 'doodle-admin-auto-confirm'
const ALBUM_PAGE_SIZE = 12

type Doodle = {
  id: string
  artist: string
  filename: string
  created_at: string
}

type SubmittedMessage = {
  thanksMessage: string
  drawAgainMessage: string
}

const SUBMITTED_MESSAGES: SubmittedMessage[] = [
  {
    thanksMessage: 'Doodle received. 🫡',
    drawAgainMessage: 'Draw again',
  },
  {
    thanksMessage: 'take my money 💳💳💥💥',
    drawAgainMessage: 'Draw again',
  },
  {
    thanksMessage: 'I think we just witnessed history.',
    drawAgainMessage: 'Draw again',
  },
  {
    thanksMessage: "The internet wasn't ready for this one.",
    drawAgainMessage: 'Draw again',
  },
  {
    thanksMessage: 'I think we just found the next Picasso.',
    drawAgainMessage: 'Draw again',
  },
  {
    thanksMessage: '10/10 would hang on my fridge.',
    drawAgainMessage: 'Draw again',
  },
]

function pickSubmittedMessage() {
  return SUBMITTED_MESSAGES[
    Math.floor(Math.random() * SUBMITTED_MESSAGES.length)
  ]
}

export function DoodlePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const canvasRef = useRef<DoodleCanvasHandle>(null)
  const [guest, setGuest] = useState(() => loadOrCreateGuest())
  const [gallery, setGallery] = useState<Doodle[]>([])
  const [albumLoading, setAlbumLoading] = useState(true)
  const [albumError, setAlbumError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedMessage, setSubmittedMessage] =
    useState<SubmittedMessage | null>(null)
  const [canvasKey, setCanvasKey] = useState(0)
  const [adminSecret, setAdminSecret] = useState(
    () => sessionStorage.getItem(ADMIN_SECRET_KEY) ?? '',
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [adminError, setAdminError] = useState('')
  const [autoConfirm, setAutoConfirm] = useState(
    () => sessionStorage.getItem(ADMIN_AUTO_CONFIRM_KEY) === '1',
  )
  const [visibleCount, setVisibleCount] = useState(ALBUM_PAGE_SIZE)
  const adminPromptHandled = useRef(false)

  const isAdmin = adminSecret.length > 0
  const visibleGallery = gallery.slice(0, visibleCount)
  const hasMore = visibleCount < gallery.length

  useEffect(() => {
    let cancelled = false

    async function loadAlbum() {
      try {
        const response = await fetch(`${API_BASE}/api/doodles`)
        if (!response.ok) throw new Error()
        const doodles = (await response.json()) as Doodle[]
        if (!cancelled) setGallery(doodles)
      } catch {
        if (!cancelled) setAlbumError('Could not load album.')
      } finally {
        if (!cancelled) setAlbumLoading(false)
      }
    }

    void loadAlbum()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (searchParams.get('admin') !== '1' || isAdmin) return
    if (adminPromptHandled.current) return
    adminPromptHandled.current = true

    const entered = window.prompt('Admin secret')
    if (entered && entered.trim()) {
      const secret = entered.trim()
      sessionStorage.setItem(ADMIN_SECRET_KEY, secret)
      setAdminSecret(secret)
      setAdminError('')
    }

    // Drop ?admin=1 so refresh doesn't keep re-prompting if they cancel.
    const next = new URLSearchParams(searchParams)
    next.delete('admin')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams, isAdmin])

  const handleSubmit = async () => {
    if (submitted || submitting) return

    const canvas = canvasRef.current
    if (!canvas || canvas.isEmpty()) {
      setSubmitError('Draw something first.')
      return
    }

    const nextGuest = updateGuestName(guest.displayName, guest)
    setGuest(nextGuest)
    const imageDataUrl = canvas.toDataURL()

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch(`${API_BASE}/api/doodles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist: nextGuest.displayName,
          image: imageDataUrl,
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            'Too many requests - please try again in a few moments.',
          )
        }
        const message = await response.text()
        throw new Error(message || 'Failed to save doodle.')
      }

      const saved = (await response.json()) as Doodle
      setGallery((prev) => [saved, ...prev])
      setSubmittedMessage(pickSubmittedMessage())
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to save doodle.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDrawAgain = () => {
    setSubmitError('')
    setSubmittedMessage(null)
    setSubmitted(false)
    setCanvasKey((key) => key + 1)
  }

  const handleNameChange = (displayName: string) => {
    setGuest((current) => ({
      ...current,
      displayName: displayName.slice(0, MAX_DISPLAY_NAME_LENGTH),
    }))
  }

  const handleNameBlur = (event: FocusEvent<HTMLInputElement>) => {
    setGuest((current) => updateGuestName(event.target.value, current))
  }

  const handleShuffleAvatar = () => {
    setGuest((current) => shuffleGuestAvatar(current))
  }

  const handleExitAdmin = () => {
    sessionStorage.removeItem(ADMIN_SECRET_KEY)
    setAdminSecret('')
    setAdminError('')
    setDeletingId(null)
  }

  const handleAutoConfirmChange = (enabled: boolean) => {
    setAutoConfirm(enabled)
    if (enabled) {
      sessionStorage.setItem(ADMIN_AUTO_CONFIRM_KEY, '1')
    } else {
      sessionStorage.removeItem(ADMIN_AUTO_CONFIRM_KEY)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin || deletingId) return
    if (!autoConfirm && !window.confirm('Delete this doodle?')) return

    setDeletingId(id)
    setAdminError('')

    try {
      const response = await fetch(`${API_BASE}/api/doodles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminSecret}` },
      })

      if (response.status === 401) {
        throw new Error('Wrong admin secret.')
      }
      if (!response.ok && response.status !== 204) {
        const message = await response.text()
        throw new Error(message || 'Failed to delete doodle.')
      }

      setGallery((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : 'Failed to delete doodle.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="doodle-page">
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <header className="detail-header">
        <h1>Doodle</h1>
        <p>Leave your mark on my little corner of the internet.</p>
      </header>

      <DoodleCanvas key={canvasKey} ref={canvasRef} locked={submitted} />

      <div className="doodle-form">
        <p className="doodle-form-label">Drawing as</p>
        <div className="doodle-identity">
          <button
            type="button"
            className="doodle-avatar-btn has-tooltip"
            onClick={handleShuffleAvatar}
            disabled={submitted || submitting}
            data-tooltip="Shuffle avatar"
            aria-label="Shuffle avatar"
          >
            <PixelArtAvatar
              className="doodle-identity-avatar"
              seed={guest.avatarSeed}
            />
          </button>
          <input
            id="doodle-artist"
            className="doodle-name-input"
            type="text"
            value={guest.displayName}
            onChange={(event) => handleNameChange(event.target.value)}
            onBlur={handleNameBlur}
            placeholder="little-elephant"
              maxLength={MAX_DISPLAY_NAME_LENGTH}
            autoComplete="nickname"
            disabled={submitted || submitting}
            readOnly={submitted}
            aria-label="Display name"
          />
        </div>

        <button
          type="button"
          className="doodle-btn doodle-btn--primary doodle-submit"
          onClick={handleSubmit}
          disabled={submitted || submitting}
        >
          {submitted ? 'Submitted' : submitting ? 'Submitting…' : 'Submit doodle'}
        </button>
      </div>

      {submitError && <p className="doodle-error">{submitError}</p>}
      {submitted && submittedMessage && (
        <p className="doodle-submitted-note">
          {submittedMessage.thanksMessage}{' '}
          <button
            type="button"
            className="inline-link doodle-draw-again"
            onClick={handleDrawAgain}
          >
            {submittedMessage.drawAgainMessage}
          </button>
          .
        </p>
      )}

      <section className="doodle-gallery">
        <div className="doodle-gallery-header">
          <h2>Album</h2>
          {isAdmin && (
            <div className="doodle-admin-controls">
              <label className="doodle-auto-confirm">
                <input
                  type="checkbox"
                  checked={autoConfirm}
                  onChange={(event) =>
                    handleAutoConfirmChange(event.target.checked)
                  }
                />
                Auto-confirm deletes
              </label>
              <button
                type="button"
                className="inline-link doodle-admin-toggle"
                onClick={handleExitAdmin}
              >
                Exit admin
              </button>
            </div>
          )}
        </div>
        {adminError && <p className="doodle-error">{adminError}</p>}
        {albumLoading ? (
          <p>Loading album…</p>
        ) : albumError ? (
          <p className="doodle-error">{albumError}</p>
        ) : gallery.length === 0 ? (
          <p>No doodles yet — be the first.</p>
        ) : (
          <>
            <ul className="doodle-gallery-list">
              {visibleGallery.map((entry) => (
                <li key={entry.id} className="doodle-gallery-item">
                  <div className="doodle-gallery-media">
                    <img
                      className="doodle-gallery-doodle"
                      src={`${API_BASE}/uploads/${entry.filename}`}
                      alt={`Doodle by ${entry.artist}`}
                    />
                    {isAdmin && (
                      <button
                        type="button"
                        className="doodle-delete-btn"
                        onClick={() => void handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        aria-label={`Delete doodle by ${entry.artist}`}
                      >
                        {deletingId === entry.id ? '…' : '×'}
                      </button>
                    )}
                  </div>
                  <div className="doodle-gallery-artist">
                    <PixelArtAvatar
                      className="doodle-gallery-avatar"
                      seed={entry.artist}
                    />
                    <p>{entry.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
            {hasMore && (
              <button
                type="button"
                className="doodle-btn doodle-load-more"
                onClick={() =>
                  setVisibleCount((count) => count + ALBUM_PAGE_SIZE)
                }
              >
                Load more
              </button>
            )}
          </>
        )}
      </section>
    </main>
  )
}
