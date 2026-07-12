import { useEffect, useState } from 'react'

const vancouverTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Vancouver',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
})

function formatVancouverClock(date: Date) {
  const parts = vancouverTime.formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return `${get('hour')}:${get('minute')}:${get('second')} ${get('dayPeriod').toLowerCase()} · Vancouver, BC`
}

export function VancouverClock() {
  const [label, setLabel] = useState(() => formatVancouverClock(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => {
      setLabel(formatVancouverClock(new Date()))
    }, 1000)

    return () => window.clearInterval(id)
  }, [])

  return (
    <time className="home-clock" dateTime={new Date().toISOString()}>
      {label}
    </time>
  )
}
