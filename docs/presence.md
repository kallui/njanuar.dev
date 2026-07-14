# Presence & same-page cursors

Archive of the phases and steps to built multiplayer presence aspect on njanuar.dev: guest identity in `localStorage` (not IP/cookie), site-wide roster, page-scoped cursors. No shared drawing in this version.

## Bandwidth / cost estimates (DigitalOcean)

**Billing facts (DO):** outbound transfer counts against the Droplet allowance; **inbound is free**; overage is **$0.01 / GiB**. Included monthly transfer is **plan-dependent** (check Billing → bandwidth). Budget below used **~200 GiB** — confirm on the droplet (Basic plans often include **500+ GiB**).

**What burns transfer**

| Factor                                           | Effect                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| Page/asset loads (HTML, JS, images, doodle PNGs) | Usually **most** of outbound for a portfolio                             |
| Cursor fanout (WS)                               | Grows with **same-page concurrent cursors** (roughly ∝ `C × (C−1) × Hz`) |
| Presence roster (join/leave/profile)             | Tiny vs cursors / pages                                                  |
| Session length                                   | Longer sessions → more cursor minutes, not more first loads              |
| Desktop vs mobile                                | Mobile does not send cursors (`pointer: coarse`) → less WS               |
| Soft caps                                        | **40** connections site-wide; **12** cursors/page; **~12 Hz** server     |

**Assumptions**

- Avg visit download **~2 MB** outbound (SPA + assets; cached returns much less — pessimistic first-load-ish averages)
- Desktop share **~50%**; of those, cursors active **~50%** of the session
- Client aims **15 Hz**, server hard-caps **~12 Hz**; cursor payload ~**120 B** after fanout metadata
- Peak same-page cursors estimated from traffic (never above **12**)
- Month ≈ **30 days**

| Scenario                 | Users / day | Session   | Peak site concurrent (approx.) | Peak same-page cursors | Est. HTTP outbound / mo   | Est. WS cursors / mo            | Est. total / mo    | vs **200 GiB**       | Overage @ **$0.01/GiB**                        |
| ------------------------ | ----------- | --------- | ------------------------------ | ---------------------- | ------------------------- | ------------------------------- | ------------------ | -------------------- | ---------------------------------------------- |
| Quiet portfolio          | 20–40       | 10 min    | 1–2                            | 1–2                    | ~2–4 GiB                  | under 1 GiB                     | **~3–5 GiB**       | Well under           | **$0**                                         |
| Light traffic            | ~100        | 10–12 min | 2–4                            | 2–3                    | ~8–12 GiB                 | **~1–3 GiB**                    | **~10–15 GiB**     | Well under           | **$0**                                         |
| Growing                  | ~500        | 12–15 min | 5–10                           | 3–6                    | ~30–50 GiB                | **~5–15 GiB**                   | **~40–65 GiB**     | Under                | **$0**                                         |
| Busy launch week         | ~2,000      | 15 min    | 15–25 (conn-capped at 40)      | 8–12                   | ~100–150 GiB              | **~30–80 GiB**                  | **~130–220 GiB**   | Near / slightly over | **$0–~$2**                                     |
| Unreal sustained viral\* | ~10,000     | 15 min    | Hit **40** conn cap            | **12** (cap)           | Can be **200+ GiB** alone | WS capped but still tens of GiB | **Often over 200** | Over                 | **Depends on assets** ($1–$5+ if +100–500 GiB) |

\*At viral scale, **static assets / album images** dominate long before cursors do. Cursor soft-caps keep WS from exploding; CDN later if needed.

**Takeaway:** for realistic personal-site traffic (tens–low hundreds/day, ~10–15 min sessions), presence+cursors are **cheap noise** inside a 200 GiB allowance. Droplet CPU/RAM flat fee stays the main cost; bandwidth overage only becomes interesting if the **site itself** (images, many uncached loads) blows up — not because of 12 Hz cursors.

## Phase 0 — Scope

- Presence on all pages (site-wide roster)
- Cursors on all pages, but **page-scoped** — only peers with the same `pathname` (Home ≠ Doodle ≠ etc.)
- Default everywhere with same-page filtering; optional later: disable cursors on specific pages for UX

## Phase 1 — Guest identity (frontend)

- Guest module in `localStorage`: `id`, `displayName`, `avatarSeed`, `color`, `createdAt` (ISO timestamp)
- Helpers: `loadOrCreateGuest()`, `updateName()`, `shuffleAvatar()`
- **Expiry:** if `now - createdAt` exceeds TTL (**24 hours**), discard and create a fresh guest
- Rename/shuffle keep the same `createdAt` (TTL from first assign of that persona, not last activity)
- Wired doodle form to guest; identity does not regen on “draw again” (unless expired on load)
- UI: avatar preview + shuffle next to name
- `guest.ts` + doodle identity UI; `App` creates guest on any landing page

## Phase 2 — Album `avatar_seed` (backend + frontend)

- Extended Go types + POST with `avatar_seed`; stored in `index.json`
- Submit sends `artist` + `avatar_seed`
- Album uses `entry.avatar_seed` (no legacy fallback — schema was introduced before public traffic)

## Phase 3 — Shared app shell (frontend)

- Layout around routes (`Outlet` + top-right presence slot)
- Guest available on every page via `GuestProvider`
- Track `currentPage` from `location.pathname`
- `AppLayout` + `PresenceBar` showing local guest (page tooltip); live roster comes in Phase 5

## Phase 4 — WebSocket hub (backend)

- Endpoint: `GET /ws` in `backend/hub.go`
- In-memory hub with soft limits (see table below), idle timeout, origin check
- Cursor fanout only to peers with the same `page`

**Client → server:** `hello`, `profile`, `page`, `cursor` (normalized x/y 0–1), `ping`

**Server → client:** `roster`, `peer_join`, `peer_leave`, `peer_update`, `cursor`, `pong`, `error`

Soft limits: 40 conns, 12 cursors/page, ~12 Hz, 90s idle, 4 KiB msgs.

## Phase 5 — Site-wide presence UI

- One WS from layout (`PresenceProvider`); send guest + page on connect
- Update on rename/shuffle/navigation
- Avatar stack from roster; reconnect refreshes roster
- Tabs on different pages see each other in the stack
- WS URL via `getWsUrl()` (`VITE_WS_URL` / same-origin `/ws` / localhost)

## Phase 6 — Same-page cursors

- `CursorLayer` on all pages; only render peers where `peer.page === myPage`
- Throttle pointer moves: **~15 Hz** client-side; server drops faster than **~12 Hz**
- Normalized coords (0–1 viewport); hide own cursor; fade/remove idle peers after **3s**
- Respect cursor slots from soft limits (`maxCursorsPerPage`); over-cap peers stay in presence only
- Touch-primary (`pointer: coarse`): do not send cursors; still receive others + full presence

### Presence bar polish

- Max **~5 faces** (you + 4 peers), then circular `+N` tucked in the stack
- Dark circle backgrounds; softer color rings; stack ~82% opacity
- Hover/press expands faces left; **900ms** delay before collapse (mobile-friendly)
- Tooltips right-anchored so they stay on-screen

## Soft limits (enforced in `hub.go`)

| Limit                                        | Value                                                           | Behavior when hit                                                         |
| -------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Max WebSocket connections                    | **40** site-wide                                                | Reject upgrade (`503` / close); presence feels “full”                     |
| Max presence faces in UI                     | **5** (you + 4 peers)                                           | Still track more server-side up to connection cap; UI shows circular `+N` |
| Max cursors tracked / broadcast **per page** | **12**                                                          | Extra peers on that page stay in presence only (no cursor fanout)         |
| Cursor send rate per client                  | **~12 Hz** server (`cursorMinInterval`); client aims **~15 Hz** | Server drops excess                                                       |
| Idle timeout                                 | **90s**                                                         | Close socket; drop from roster                                            |
| Max message size                             | **4 KiB**                                                       | Close abusive clients                                                     |

Notes:

- Presence can stay allowed under the connection cap even when cursor slots for a page are full — site still feels alive.
- Cursor slots are **per page**, not global “12 cursors for the whole site.”
- Client 15 Hz + server 12 Hz is intentional: slight client headroom; server is the hard cap.
- Reject / degrade gracefully; don’t crash the hub.
- Optional later: max connections per IP (light anti-abuse), e.g. 5.

## Phase 7 — Deploy / ops

- Soft limits enforced in the Go hub
- Frontend: `VITE_WS_URL` (or derive `wss://…` from API URL / same origin)
- Single API instance (in-memory hub; no sticky sessions)
- Nginx on the VPS proxies `/ws` to the API with upgrade headers

### Production (nginx)

Site static files and Go API deploy via GitHub Actions. Presence needs nginx to proxy `/ws` to the API:

```nginx
# HTTP API
location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# WebSocket presence hub
location /ws {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Deploy checks:

- `/ws` proxies to `njanuar-api` with `Upgrade` / `Connection`
- Frontend prod build points WS at `wss://…` (same host as API is simplest)
- Origin checks on Go allow the real site origin (not only localhost)
- Two browsers after deploy: presence stack + same-page cursors
- Uploads / `/api` still work unchanged

Locally: Vite + `go run` with `ws://localhost:8080/ws` — no nginx required.

## Build order

`identity → album seed → layout shell → WS hub → presence UI → cursors → deploy (nginx)`

## Identity note

- Presence = live WS session, labeled by client guest `id` in `localStorage`
- Not IP-based; cookie optional/not required
- Dedupe multiple tabs by guest `id` in the presence stack
- Guest expires after **24h** from `createdAt` — temporary persona, stable within a day
- Alternative if preferred later: slide expiry on activity (`updatedAt`) so long active visits don’t roll mid-session
