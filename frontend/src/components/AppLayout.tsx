import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PresenceBar } from './PresenceBar'
import { CursorLayer } from './CursorLayer'

export function AppLayout() {
  const { pathname } = useLocation()
  const scrollPositions = useRef<Record<string, number>>({})

  useLayoutEffect(() => {
    window.scrollTo(0, scrollPositions.current[pathname] ?? 0)

    return () => {
      scrollPositions.current[pathname] = window.scrollY
    }
  }, [pathname])

  return (
    <>
      <PresenceBar />
      <CursorLayer />
      <Outlet />
    </>
  )
}
