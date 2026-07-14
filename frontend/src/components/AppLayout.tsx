import { Outlet } from 'react-router-dom'
import { PresenceBar } from './PresenceBar'
import { CursorLayer } from './CursorLayer'

export function AppLayout() {
  return (
    <>
      <PresenceBar />
      <CursorLayer />
      <Outlet />
    </>
  )
}
