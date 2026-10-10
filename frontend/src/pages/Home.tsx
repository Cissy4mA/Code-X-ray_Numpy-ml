import OrbitPages from '@/sections/OrbitPages'
import LearnSection from '@/sections/LearnSection'

type View = 'home' | 'search' | 'learn'

export default function Home({ view = 'home' }: { view?: View }) {
  if (view === 'learn') {
    return <LearnSection />
  }
  return (
    <div className="h-screen overflow-hidden">
      <OrbitPages view={view === 'search' ? 'search' : 'home'} />
    </div>
  )
}
