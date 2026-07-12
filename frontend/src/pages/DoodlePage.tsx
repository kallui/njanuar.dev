import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DoodleCanvas,
  type DoodleCanvasHandle,
} from '../components/DoodleCanvas'
import { generateAnonymousName } from '../utils/anonymousName'
import { PixelArtAvatar } from '../components/PixelArtAvatar'

type DoodleEntry = {
  id: string
  name: string
  imageDataUrl: string
  createdAt: number
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
    thanksMessage: 'WOW, that looks amazing! 😮😮😮',
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
  const [name, setName] = useState(() => generateAnonymousName())
  const [gallery, setGallery] = useState<DoodleEntry[]>([])
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedMessage, setSubmittedMessage] =
    useState<SubmittedMessage | null>(null)
  const [canvasKey, setCanvasKey] = useState(0)

  const handleSubmit = () => {
    if (submitted) return

    const canvas = canvasRef.current
    if (!canvas || canvas.isEmpty()) {
      setError('Draw something first.')
      return
    }

    const trimmed = name.trim()
    const finalName = trimmed || generateAnonymousName()
    const entry: DoodleEntry = {
      id: crypto.randomUUID(),
      name: finalName,
      imageDataUrl: canvas.toDataURL(),
      createdAt: Date.now(),
    }

    setName(finalName)
    setGallery((prev) => [entry, ...prev])
    setError('')
    setSubmittedMessage(pickSubmittedMessage())
    setSubmitted(true)
  }

  const handleDrawAgain = () => {
    setName(generateAnonymousName())
    setError('')
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
        <label className="doodle-name-field" htmlFor="doodle-name">
          <span>Name</span>
          <input
            id="doodle-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="little-elephant23"
            maxLength={40}
            autoComplete="nickname"
            disabled={submitted}
            readOnly={submitted}
          />
        </label>

        <div className="doodle-actions">
          <button
            type="button"
            className="doodle-btn doodle-btn--primary"
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? 'Submitted' : 'Submit'}
          </button>
        </div>
      </div>

      {error && <p className="doodle-error">{error}</p>}
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
        {gallery.length === 0 ? (
          <p>No doodles yet — be the first.</p>
        ) : (
          <ul className="doodle-gallery-list">
            {gallery.map((entry) => (
              <li key={entry.id} className="doodle-gallery-item">
                <img
                  className="doodle-gallery-doodle"
                  src={entry.imageDataUrl}
                  alt={`Doodle by ${entry.name}`}
                />
                <div className="doodle-gallery-artist">
                  <PixelArtAvatar
                    className="doodle-gallery-avatar"
                    seed={entry.name}
                  />
                  <p>{entry.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
