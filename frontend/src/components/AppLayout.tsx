import { Outlet } from 'react-router-dom'
import { PresenceBar } from './PresenceBar'

export function AppLayout() {
  return (
    <>
      <PresenceBar />
      <Outlet />
    </>
  )
}
