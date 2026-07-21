import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dock } from './components/Dock'
import { AppLayout } from './components/AppLayout'
import { Home } from './pages/Home'
import { DetailPage } from './pages/DetailPage'
import { DoodlePage } from './pages/DoodlePage'
import { DevOpsPage } from './pages/DevOpsPage'
import { GuestProvider } from './context/GuestContext'
import { PresenceProvider } from './context/PresenceContext'

function App() {
  return (
    <BrowserRouter>
      <GuestProvider>
        <PresenceProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/devops" element={<DevOpsPage />} />
              <Route path="/doodle" element={<DoodlePage />} />
              <Route path="/work/:slug" element={<DetailPage />} />
              <Route path="/industry/:slug" element={<DetailPage />} />
              <Route path="/projects/:slug" element={<DetailPage />} />
            </Route>
          </Routes>
          <Dock />
        </PresenceProvider>
      </GuestProvider>
    </BrowserRouter>
  )
}

export default App
