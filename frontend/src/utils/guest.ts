import { generateAnonymousName } from './anonymousName'

const STORAGE_KEY = 'njanuar-guest'
const TTL_MS = 24 * 60 * 60 * 1000
export const MAX_DISPLAY_NAME_LENGTH = 18

const COLORS = [
  '#E85D4C',
  '#3B82F6',
  '#22A06B',
  '#D97706',
  '#7C3AED',
  '#0D9488',
  '#DB2777',
]

export type Guest = {
  id: string
  displayName: string
  avatarSeed: string
  color: string
  createdAt: string
}

function generateColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function createGuest(): Guest {
  return {
    id: crypto.randomUUID(),
    displayName: generateAnonymousName(),
    avatarSeed: crypto.randomUUID(),
    color: generateColor(),
    createdAt: new Date().toISOString(),
  }
}

function saveGuest(guest: Guest) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guest))
}

function isValidGuest(value: unknown): value is Guest {
  if (!value || typeof value !== 'object') return false
  const g = value as Record<string, unknown>
  return (
    typeof g.id === 'string' &&
    typeof g.displayName === 'string' &&
    typeof g.avatarSeed === 'string' &&
    typeof g.color === 'string' &&
    typeof g.createdAt === 'string'
  )
}

function isExpired(guest: Guest) {
  const created = Date.parse(guest.createdAt)
  if (Number.isNaN(created)) return true
  return Date.now() - created > TTL_MS
}

/** Load guest from localStorage, or create one. Expired guests are replaced. */
export function loadOrCreateGuest(): Guest {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isValidGuest(parsed) && !isExpired(parsed)) {
        return parsed
      }
    }
  } catch {
    // Corrupt storage — fall through and create fresh.
  }

  const guest = createGuest()
  saveGuest(guest)
  return guest
}

/** Update display name. Keeps createdAt (same 24h identity window). */
export function updateGuestName(
  displayName: string,
  current: Guest = loadOrCreateGuest(),
): Guest {
  const trimmed = displayName.trim().slice(0, MAX_DISPLAY_NAME_LENGTH)
  const guest: Guest = {
    ...current,
    displayName: trimmed || generateAnonymousName(),
  }
  saveGuest(guest)
  return guest
}

/** New DiceBear face. Keeps name and createdAt. Pass current guest so unsaved name edits aren't lost. */
export function shuffleGuestAvatar(
  current: Guest = loadOrCreateGuest(),
): Guest {
  const guest: Guest = {
    ...current,
    avatarSeed: crypto.randomUUID(),
  }
  saveGuest(guest)
  return guest
}
