import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'

// Views: 'home' | 'search' — Orbit's internal two views.
// 'learn' — the 3D card-deck learning page.
type View = 'home' | 'search' | 'learn'

function readView(): View {
  const h = location.hash
  if (h.startsWith('#/learn')) return 'learn'
  if (h.startsWith('#/search') || h === '#search') return 'search'
  return 'home'
}

export default function App() {
  const [view, setView] = useState<View>(readView)
  const loc = useLocation()

  // Router navigation (react-router links) -> plain hash mode
  useEffect(() => {
    const p = loc.pathname
    if (p === '/learn' && location.hash !== '#/learn') {
      location.hash = '#/learn'
    }
  }, [loc])

  // Plain hash changes (from Orbit's internal links / popstate) -> view
  useEffect(() => {
    const onHash = () => setView(readView())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <Routes>
      <Route path="*" element={<Home view={view} />} />
    </Routes>
  )
}
