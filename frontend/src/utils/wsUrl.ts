/** Resolve WebSocket URL for the presence hub. */
export function getWsUrl(): string {
  const explicit = import.meta.env.VITE_WS_URL as string | undefined
  if (explicit) return explicit

  // '' = same origin (prod nginx proxies /ws). unset = local API default.
  const raw = import.meta.env.VITE_API_URL as string | undefined
  if (raw === '') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ws`
  }

  const api = raw ?? 'http://localhost:8080'
  return `${api.replace(/^http/, 'ws').replace(/\/$/, '')}/ws`
}
