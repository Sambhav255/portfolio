import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useLenis } from './hooks/useLenis'
import { useMagnetic } from './hooks/useMagnetic'
import { Scene } from './components/Scene'
import { Navbar, TabId } from './components/Navbar'
import { HomeView } from './components/HomeView'
import { ProjectsSection } from './components/ProjectsSection'
import { JourneyResume } from './components/JourneyResume'
import { ContactSection } from './components/ContactSection'
import experience from './experience.json'
import './index.css'

function App() {
  useLenis()
  useMagnetic()
  const scrollProgressRef = useRef(0)
  const morphProgressRef = useRef(0)
  const journeyGlowRef = useRef(0)
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [cursorExpanded, setCursorExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const prevTabRef = useRef<TabId>('home')

  const TAB_PROGRESS: Record<TabId, number> = {
    home: 0,
    projects: 0.4,
    journey: 0.6,
    contact: 0.9,
  }

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3952a87a-600c-469a-8b44-53ba21afdd5b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'initial',
        hypothesisId: 'H0',
        location: 'src/App.tsx:32',
        message: 'App mounted',
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion agent log
  }, [])

  useEffect(() => {
    morphProgressRef.current = activeTab === 'journey' ? 1 : 0
    journeyGlowRef.current = activeTab === 'journey' ? 1 : 0
    scrollProgressRef.current = TAB_PROGRESS[activeTab]
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3952a87a-600c-469a-8b44-53ba21afdd5b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'initial',
        hypothesisId: 'H1',
        location: 'src/App.tsx:33',
        message: 'activeTab changed',
        data: { activeTab, tabProgress: TAB_PROGRESS[activeTab] },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion agent log
  }, [activeTab])

  useEffect(() => {
    // #region agent log
    const badge = document.getElementById('__bootbadge')
    if (badge) badge.textContent = 'REACT: App mounted'
    // #endregion agent log
  }, [])

  useEffect(() => {
    const prev = prevTabRef.current
    const next = activeTab
    prevTabRef.current = next
    const outgoing = panelRef.current?.querySelector(`[data-tab="${prev}"]`) as HTMLElement
    const incoming = panelRef.current?.querySelector(`[data-tab="${next}"]`) as HTMLElement
    if (prev !== next) {
      if (outgoing) gsap.to(outgoing, { opacity: 0, duration: 0.2, ease: 'power2.in' })
      if (incoming) gsap.fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.05 })
    } else if (incoming) {
      gsap.set(incoming, { opacity: 1 })
    }
  }, [activeTab])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.closest?.('.btn-glass') || target?.closest?.('.project-card') || target?.closest?.('.journey-card')) {
        setCursorExpanded(true)
      }
    }
    const handleOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement
      if (!related?.closest?.('.btn-glass') && !related?.closest?.('.project-card') && !related?.closest?.('.journey-card')) {
        setCursorExpanded(false)
      }
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    document.body.classList.add('custom-cursor')
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.body.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <Scene
        scrollProgressRef={scrollProgressRef}
        morphProgressRef={morphProgressRef}
        journeyGlowRef={journeyGlowRef}
      />
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div
        className={`cursor-ring ${cursorExpanded ? 'expanded' : ''}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
        aria-hidden="true"
      />
      <div ref={panelRef} className="tab-content">
        <div
          data-tab="home"
          className="tab-panel"
          style={{
            opacity: activeTab === 'home' ? 1 : 0,
            pointerEvents: activeTab === 'home' ? 'auto' : 'none',
          }}
        >
          <div className="tab-panel-inner">
            <HomeView />
          </div>
        </div>
        <div
          data-tab="projects"
          className="tab-panel"
          style={{
            opacity: activeTab === 'projects' ? 1 : 0,
            pointerEvents: activeTab === 'projects' ? 'auto' : 'none',
          }}
        >
          <div className="tab-panel-inner">
            <section className="section section-compact">
              <ProjectsSection data={experience.sections[2]} projects={experience.projects} />
            </section>
          </div>
        </div>
        <div
          data-tab="journey"
          className="tab-panel"
          style={{
            opacity: activeTab === 'journey' ? 1 : 0,
            pointerEvents: activeTab === 'journey' ? 'auto' : 'none',
          }}
        >
          <div className="tab-panel-inner journey-section-wrapper">
            <JourneyResume />
          </div>
        </div>
        <div
          data-tab="contact"
          className="tab-panel"
          style={{
            opacity: activeTab === 'contact' ? 1 : 0,
            pointerEvents: activeTab === 'contact' ? 'auto' : 'none',
          }}
        >
          <div className="tab-panel-inner">
            <section className="section section-compact">
              <ContactSection data={experience.sections[3]} contact={experience.contact} />
            </section>
          </div>
        </div>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default App
