import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dock } from './components/Dock'
import { Home } from './pages/Home'
import { DetailPage } from './pages/DetailPage'
import { DoodlePage } from './pages/DoodlePage'
import { loadOrCreateGuest } from './utils/guest'

function App() {
  // Site-wide guest identity — create on first visit to any page, not only /doodle.
  useEffect(() => {
    loadOrCreateGuest()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doodle" element={<DoodlePage />} />
        <Route path="/work/:slug" element={<DetailPage />} />
        <Route path="/industry/:slug" element={<DetailPage />} />
        <Route path="/projects/:slug" element={<DetailPage />} />
      </Routes>
      <Dock />
    </BrowserRouter>
  )
}

export default App
