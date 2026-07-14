import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  loadOrCreateGuest,
  MAX_DISPLAY_NAME_LENGTH,
  shuffleGuestAvatar,
  updateGuestName,
  type Guest,
} from '../utils/guest'

type GuestContextValue = {
  guest: Guest
  currentPage: string
  setDisplayName: (displayName: string) => void
  commitDisplayName: (displayName?: string) => Guest
  shuffleAvatar: () => Guest
}

const GuestContext = createContext<GuestContextValue | null>(null)

export function GuestProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [guest, setGuest] = useState(() => loadOrCreateGuest())
  const guestRef = useRef(guest)
  guestRef.current = guest
  const currentPage = location.pathname

  const setDisplayName = useCallback((displayName: string) => {
    setGuest((current) => ({
      ...current,
      displayName: displayName.slice(0, MAX_DISPLAY_NAME_LENGTH),
    }))
  }, [])

  const commitDisplayName = useCallback((displayName?: string) => {
    const next = updateGuestName(
      displayName ?? guestRef.current.displayName,
      guestRef.current,
    )
    guestRef.current = next
    setGuest(next)
    return next
  }, [])

  const shuffleAvatar = useCallback(() => {
    const next = shuffleGuestAvatar(guestRef.current)
    guestRef.current = next
    setGuest(next)
    return next
  }, [])

  const value = useMemo(
    () => ({
      guest,
      currentPage,
      setDisplayName,
      commitDisplayName,
      shuffleAvatar,
    }),
    [guest, currentPage, setDisplayName, commitDisplayName, shuffleAvatar],
  )

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
}

export function useGuest() {
  const ctx = useContext(GuestContext)
  if (!ctx) {
    throw new Error('useGuest must be used within GuestProvider')
  }
  return ctx
}
