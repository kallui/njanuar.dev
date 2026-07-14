import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useGuest } from './GuestContext'
import { getWsUrl } from '../utils/wsUrl'

export type PresencePeer = {
  id: string
  displayName: string
  avatarSeed: string
  color: string
  page: string
  cursorOk: boolean
}

export type PeerCursor = {
  id: string
  displayName: string
  color: string
  x: number // 0–1 viewport-normalized
  y: number
  updatedAt: number
}

type ServerPeer = {
  id: string
  display_name: string
  avatar_seed: string
  color: string
  page: string
  cursor_ok: boolean
}

type ServerMessage = {
  type: string
  peers?: ServerPeer[]
  peer?: ServerPeer
  id?: string
  x?: number
  y?: number
  page?: string
}

type PresenceContextValue = {
  peers: PresencePeer[]
  cursors: PeerCursor[]
  status: 'connecting' | 'open' | 'closed'
  sendCursor: (x: number, y: number) => void
}

const PresenceContext = createContext<PresenceContextValue | null>(null)

export const PRESENCE_UI_LIMIT = 5
const CURSOR_IDLE_MS = 3_000
const PROFILE_DEBOUNCE_MS = 300
const RECONNECT_MIN_MS = 800
const RECONNECT_MAX_MS = 10_000
const CURSOR_THROTTLE_MS = 1000 / 15 // ~15 Hz client-side

function toPeer(p: ServerPeer): PresencePeer {
  return {
    id: p.id,
    displayName: p.display_name,
    avatarSeed: p.avatar_seed,
    color: p.color,
    page: p.page,
    cursorOk: p.cursor_ok,
  }
}

function upsertPeer(
  list: PresencePeer[],
  peer: PresencePeer,
  selfId: string,
): PresencePeer[] {
  if (peer.id === selfId) return list
  const i = list.findIndex((p) => p.id === peer.id)
  if (i === -1) return [...list, peer]
  const next = list.slice()
  next[i] = peer
  return next
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { guest, currentPage } = useGuest()
  const [peers, setPeers] = useState<PresencePeer[]>([])
  const [cursors, setCursors] = useState<PeerCursor[]>([])
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>(
    'connecting',
  )

  const wsRef = useRef<WebSocket | null>(null)
  const guestRef = useRef(guest)
  const pageRef = useRef(currentPage)
  const peersRef = useRef(peers)
  const aliveRef = useRef(true)
  const reconnectAttempt = useRef(0)
  const profileTimer = useRef<number | null>(null)
  const helloSentRef = useRef(false)
  const lastCursorSentAt = useRef(0)

  guestRef.current = guest
  pageRef.current = currentPage
  peersRef.current = peers

  const send = useCallback((payload: Record<string, unknown>) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify(payload))
  }, [])

  const sendHello = useCallback(() => {
    const g = guestRef.current
    send({
      type: 'hello',
      id: g.id,
      display_name: g.displayName,
      avatar_seed: g.avatarSeed,
      color: g.color,
      page: pageRef.current,
    })
    helloSentRef.current = true
  }, [send])

  const sendProfile = useCallback(() => {
    const g = guestRef.current
    send({
      type: 'profile',
      display_name: g.displayName,
      avatar_seed: g.avatarSeed,
      color: g.color,
    })
  }, [send])

  const sendCursor = useCallback(
    (x: number, y: number) => {
      if (!helloSentRef.current) return
      const now = Date.now()
      if (now - lastCursorSentAt.current < CURSOR_THROTTLE_MS) return
      lastCursorSentAt.current = now
      send({ type: 'cursor', x, y })
    },
    [send],
  )

  useEffect(() => {
    aliveRef.current = true
    let reconnectTimer: number | null = null

    const connect = () => {
      if (!aliveRef.current) return

      setStatus('connecting')
      helloSentRef.current = false
      const ws = new WebSocket(getWsUrl())
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttempt.current = 0
        setStatus('open')
        sendHello()
      }

      ws.onmessage = (event) => {
        let msg: ServerMessage
        try {
          msg = JSON.parse(String(event.data)) as ServerMessage
        } catch {
          return
        }

        const selfId = guestRef.current.id

        switch (msg.type) {
          case 'roster':
            setPeers(
              (msg.peers ?? []).map(toPeer).filter((p) => p.id !== selfId),
            )
            break
          case 'peer_join':
          case 'peer_update':
            if (!msg.peer) break
            setPeers((prev) => upsertPeer(prev, toPeer(msg.peer!), selfId))
            break
          case 'peer_leave':
            if (!msg.id || msg.id === selfId) break
            setPeers((prev) => prev.filter((p) => p.id !== msg.id))
            setCursors((prev) => prev.filter((c) => c.id !== msg.id))
            break
          case 'cursor': {
            if (!msg.id || msg.id === selfId) break
            const peer = peersRef.current.find((p) => p.id === msg.id)
            if (!peer) break
            if (peer.page !== pageRef.current) break
            setCursors((prev) => {
              const i = prev.findIndex((c) => c.id === msg.id)
              const next: PeerCursor = {
                id: msg.id!,
                displayName: peer.displayName,
                color: peer.color,
                x: msg.x ?? 0,
                y: msg.y ?? 0,
                updatedAt: Date.now(),
              }
              if (i === -1) return [...prev, next]
              const copy = prev.slice()
              copy[i] = next
              return copy
            })
            break
          }
          default:
            break
        }
      }

      ws.onclose = () => {
        setStatus('closed')
        wsRef.current = null
        helloSentRef.current = false
        setPeers([])
        setCursors([])
        if (!aliveRef.current) return

        const attempt = reconnectAttempt.current++
        const delay = Math.min(
          RECONNECT_MAX_MS,
          RECONNECT_MIN_MS * 2 ** attempt,
        )
        reconnectTimer = window.setTimeout(connect, delay)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      aliveRef.current = false
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer)
      if (profileTimer.current !== null) {
        window.clearTimeout(profileTimer.current)
      }
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [sendHello])

  useEffect(() => {
    if (!helloSentRef.current) return
    send({ type: 'page', page: currentPage })
    // Clear cursors when navigating — peer positions are stale
    setCursors([])
  }, [currentPage, send])

  useEffect(() => {
    if (!helloSentRef.current) return
    if (profileTimer.current !== null) window.clearTimeout(profileTimer.current)
    profileTimer.current = window.setTimeout(() => {
      sendProfile()
    }, PROFILE_DEBOUNCE_MS)
    return () => {
      if (profileTimer.current !== null) {
        window.clearTimeout(profileTimer.current)
      }
    }
  }, [guest.displayName, guest.avatarSeed, guest.color, sendProfile])

  // Idle cursor cleanup: remove cursors that haven't moved for CURSOR_IDLE_MS
  useEffect(() => {
    const interval = setInterval(() => {
      const cutoff = Date.now() - CURSOR_IDLE_MS
      setCursors((prev) => {
        const filtered = prev.filter((c) => c.updatedAt > cutoff)
        return filtered.length === prev.length ? prev : filtered
      })
    }, 1_000)
    return () => clearInterval(interval)
  }, [])

  const value = useMemo(
    () => ({ peers, cursors, status, sendCursor }),
    [peers, cursors, status, sendCursor],
  )

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  )
}

export function usePresence() {
  const ctx = useContext(PresenceContext)
  if (!ctx) {
    throw new Error('usePresence must be used within PresenceProvider')
  }
  return ctx
}
