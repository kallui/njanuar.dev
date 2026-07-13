# Presence + same-page cursors — implementation phases

Temporary working plan. Guest identity via `localStorage` (not IP/cookie). Site-wide presence + page-scoped cursors. No shared drawing in v1.

## Phase 0 — Scope

- Presence: all pages (site-wide roster)
- Cursors: **all pages**, but **page-scoped** — you only see cursors of people on the same `pathname` as you (Home ≠ Doodle ≠ etc.)
- Not “pick a subset of pages” unless we later disable cursors somewhere for UX; default is everywhere with same-page filtering

## Phase 1 — Guest identity (frontend only)

- Guest module in `localStorage`: `id`, `displayName`, `avatarSeed`, `color`, `createdAt` (ISO timestamp)
- Helpers: `loadOrCreateGuest()`, `updateName()`, `shuffleAvatar()`
- **Expiry:** if `now - createdAt` exceeds TTL (default **24 hours**), discard and create a fresh guest (new name/face/id/color)
- Any rename/shuffle during a valid guest keeps the same `createdAt` (TTL is from first assign of that persona, not last activity — simpler Docs-ish “this identity window”)
  - Alternative if preferred later: slide expiry on activity (`updatedAt`) so active visitors don’t roll mid-session after 24h of continuous use; for v1 fixed `createdAt` + 24h is fine
- Wire doodle form to guest; don’t regen identity on “draw again” (unless expired on load)
- UI: avatar preview + shuffle next to name
- Done when: same-day refresh keeps identity; next day (after TTL) gets a new one; rename/shuffle works offline
- **Status: Phase 1 implemented** (`guest.ts` + `DoodlePage` identity UI + `App` creates guest on any landing page). Album still seeds from `artist` until Phase 2.

## Phase 2 — Album `avatar_seed` (backend + frontend)

- Extend Go types + POST with `avatar_seed`; store in `index.json`
- Submit sends `artist` + `avatar_seed`
- Album uses `entry.avatar_seed` (no legacy fallback needed — app not public yet; wipe/recreate local uploads if schema changes)
- Done when: renamed/shuffled face is frozen on submit

## Phase 3 — Shared app shell (frontend)

- Layout around routes (`Outlet` + top-right presence slot)
- Guest available on every page
- Track `currentPage` from `location.pathname`
- Done when: presence chrome exists (can be placeholder)

## Phase 4 — WebSocket hub (backend)

- Endpoint e.g. `GET /ws`
- In-memory hub; messages: hello/profile/page/cursor + roster/join/leave/update/cursor
- Caps: see **Soft limits** below; idle timeout; origin check
- Cursor fanout only to peers with same `page`
- Done when: two tabs join/leave updates roster

## Phase 5 — Site-wide presence UI

- One WS from layout; send guest + page on connect
- Update on rename/shuffle/navigation
- Avatar stack from roster; reconnect refreshes roster
- Done when: tabs on different pages see each other in the stack

## Phase 6 — Same-page cursors

- Enable on all pages; only render peers where `peer.page === myPage`
- Throttle pointer moves (~10–15 Hz client-side too)
- Prefer normalized coords
- Hide own cursor; fade idle peers
- Respect cursor slots from Soft limits (don’t render / don’t send if over cap)
- Done when: same-page cursors work; other pages don’t leak

## Soft limits (precaution — bake into hub in Phase 4)

Starting defaults (tune later; prefer constants or env vars):

| Limit | Suggested v1 | Behavior when hit |
|-------|--------------|-------------------|
| Max WebSocket connections | **40** site-wide | Reject new upgrade with close code; presence stack can show “full” |
| Max presence shown in UI | **20** avatars | Still track more serverside up to connection cap; UI shows `+N` overflow |
| Max cursors tracked / broadcast per page | **12** | Extra peers on that page stay in presence only (no cursor fanout) |
| Cursor send rate per client | **12 Hz** | Drop excess server-side even if client misbehaves |
| Idle timeout | **60–90s** no ping / no activity | Close socket; drop from roster |
| Max message size | small (e.g. **2–4 KiB**) | Close abusive clients |

Notes:

- Presence can stay allowed under the connection cap even when cursor slots for a page are full — site still feels alive.
- Cursor slots are **per page** (same-page scoped), not global “12 cursors for the whole site.”
- Reject / degrade gracefully; don’t crash the hub.
- Optional later: max connections per IP (light anti-abuse), e.g. 5.

## Phase 7 — Deploy / ops

- Soft limits enforced in Go hub (table above)
- Frontend: `VITE_WS_URL` (or derive `wss://…` from API URL)
- Single API instance is OK for v1 (in-memory hub; no sticky sessions needed yet)
- **Prod needs a one-time nginx tweak** — WebSocket proxy config lives on the VPS, not only in this repo

### Production (nginx)

Site static files and Go API are already deployed via GitHub Actions. Presence requires nginx to proxy `/ws` (or your chosen path) to the API with upgrade headers.

Example — add alongside your existing API proxy (adjust upstream / listen blocks to match the server):

```nginx
# HTTP API (existing-style)
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
    # Keep long-lived connections alive
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
}
```

After editing:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Checklist:

- [ ] `/ws` (or path you choose) proxies to `njanuar-api` with `Upgrade` / `Connection`
- [ ] Frontend prod build points WS at `wss://…` (same host as API is simplest)
- [ ] CORS / origin checks on Go allow your real site origin (not only localhost)
- [ ] Confirm with two browsers after deploy (presence stack + same-page cursors)
- [ ] Uploads / `/api` still work unchanged

Localhost: no nginx required — Vite + `go run` with `ws://localhost:8080/ws` is enough until Phase 7.

## Build order

`identity → album seed → layout shell → WS hub → presence UI → cursors → deploy (nginx)`

## Identity note

- Presence = live WS session, labeled by client guest `id` in `localStorage`
- Not IP-based; cookie optional/not required for v1
- Dedupe multiple tabs by guest `id` in the presence stack
- Guest expires after **24h** from `createdAt` (see Phase 1) — closer to Docs “temporary persona,” still stable within a day
