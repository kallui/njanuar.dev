import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DoodleCanvas,
  type DoodleCanvasHandle,
} from '../components/DoodleCanvas'
import { generateAnonymousName } from '../utils/anonymousName'
import { PixelArtAvatar } from '../components/PixelArtAvatar'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

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
  const canvasRef = useRef<DoodleCanvasHandle>(null)
  const [artist, setArtist] = useState(() => generateAnonymousName())
  const [gallery, setGallery] = useState<Doodle[]>([])
  const [albumLoading, setAlbumLoading] = useState(true)
  const [albumError, setAlbumError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedMessage, setSubmittedMessage] =
    useState<SubmittedMessage | null>(null)
  const [canvasKey, setCanvasKey] = useState(0)

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

  const handleSubmit = async () => {
    if (submitted || submitting) return

    const canvas = canvasRef.current
    if (!canvas || canvas.isEmpty()) {
      setSubmitError('Draw something first.')
      return
    }

    const trimmed = artist.trim()
    const finalArtist = trimmed || generateAnonymousName()
    const imageDataUrl = canvas.toDataURL()

    setSubmitting(true)
    setSubmitError('')
    setArtist(finalArtist)

    try {
      const response = await fetch(`${API_BASE}/api/doodles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist: finalArtist, image: imageDataUrl }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to save doodle.')
      }

      const saved = (await response.json()) as Doodle
      setGallery((prev) => [saved, ...prev])
      setSubmittedMessage(pickSubmittedMessage())
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save doodle.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDrawAgain = () => {
    setArtist(generateAnonymousName())
    setSubmitError('')
    setSubmittedMessage(null)
    setSubmitted(false)
    setCanvasKey((key) => key + 1)
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
        <label className="doodle-name-field" htmlFor="doodle-artist">
          <span>Name</span>
          <input
            id="doodle-artist"
            type="text"
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            placeholder="little-elephant23"
            maxLength={40}
            autoComplete="nickname"
            disabled={submitted || submitting}
            readOnly={submitted}
          />
        </label>

        <div className="doodle-actions">
          <button
            type="button"
            className="doodle-btn doodle-btn--primary"
            onClick={handleSubmit}
            disabled={submitted || submitting}
          >
            {submitted ? 'Submitted' : submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
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
        <h2>Album</h2>
        {albumLoading ? (
          <p>Loading album…</p>
        ) : albumError ? (
          <p className="doodle-error">{albumError}</p>
        ) : gallery.length === 0 ? (
          <p>No doodles yet — be the first.</p>
        ) : (
          <ul className="doodle-gallery-list">
            {gallery.map((entry) => (
              <li key={entry.id} className="doodle-gallery-item">
                <img
                  className="doodle-gallery-doodle"
                  src={`${API_BASE}/uploads/${entry.filename}`}
                  alt={`Doodle by ${entry.artist}`}
                />
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
        )}
      </section>
    </main>
  )
}
