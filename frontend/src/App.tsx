import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dock } from './components/Dock'
import { Home } from './pages/Home'
import { DetailPage } from './pages/DetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<DetailPage />} />
        <Route path="/industry/:slug" element={<DetailPage />} />
        <Route path="/projects/:slug" element={<DetailPage />} />
      </Routes>
      <Dock />
    </BrowserRouter>
  )
}

export default App
