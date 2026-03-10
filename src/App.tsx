import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './hooks/useLenis'
import { useMagnetic } from './hooks/useMagnetic'
import { BackgroundMagnetField } from './components/BackgroundMagnetField'
import { Navbar, TabId } from './components/Navbar'
import { HomeView } from './components/HomeView'
import { ProjectsSection } from './components/ProjectsSection'
import { JourneyResume } from './components/JourneyResume'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import experience from './experience.json'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const TAB_PROGRESS: Record<TabId, number> = {
  home: 0,
  projects: 0.4,
  journey: 0.6,
  contact: 0.9,
}

function App() {
  useLenis()
  useMagnetic()
  const scrollProgressRef = useRef(0)
  const morphProgressRef = useRef(0)
  const journeyGlowRef = useRef(0)
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorExpandedRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const prevTabRef = useRef<TabId>('home')

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  useEffect(() => {
    const targetMorph = activeTab === 'journey' ? 1 : 0
    const targetGlow = activeTab === 'journey' ? 1 : 0
    const targetScroll = TAB_PROGRESS[activeTab]

    gsap.to(morphProgressRef, {
      current: targetMorph,
      duration: 1.5,
      ease: 'power2.inOut',
    })
    gsap.to(journeyGlowRef, {
      current: targetGlow,
      duration: 1.5,
      ease: 'power2.inOut',
    })
    gsap.to(scrollProgressRef, {
      current: targetScroll,
      duration: 1.5,
      ease: 'power2.inOut',
    })
  }, [activeTab])

  useEffect(() => {
    const container = panelRef.current
    if (!container) return

    const prev = prevTabRef.current
    const next = activeTab

    const panels = Array.from(container.querySelectorAll('[data-tab]')) as HTMLElement[]
    panels.forEach((p) => {
      gsap.set(p, { autoAlpha: 0 })
      p.style.position = 'absolute'
      p.style.pointerEvents = 'none'
    })

    if (prev === next) {
      const current = container.querySelector(`[data-tab="${next}"]`) as HTMLElement | null
      if (current) {
        gsap.set(current, {
          autoAlpha: 1,
          position: 'relative',
          pointerEvents: 'auto',
        })
      }
      return
    }

    prevTabRef.current = next
    const outgoing = container.querySelector(`[data-tab="${prev}"]`) as HTMLElement | null
    const incoming = container.querySelector(`[data-tab="${next}"]`) as HTMLElement | null

    window.scrollTo({ top: 0, behavior: 'auto' })

    if (outgoing) {
      gsap.to(outgoing, {
        autoAlpha: 0,
        y: -12,
        duration: 0.25,
        ease: 'power2.inOut',
        onStart: () => {
          outgoing.style.position = 'absolute'
          outgoing.style.pointerEvents = 'none'
        },
      })
    }

    if (incoming) {
      gsap.fromTo(
        incoming,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          delay: 0.1,
          onStart: () => {
            incoming.style.position = 'relative'
            incoming.style.pointerEvents = 'auto'
          },
          onComplete: () => {
            ScrollTrigger.refresh()
          },
        }
      )
    }
  }, [activeTab])

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    const ring = cursorRef.current
    if (!ring) return

    const handleMove = (e: MouseEvent) => {
      ring.style.left = `${e.clientX}px`
      ring.style.top = `${e.clientY}px`
    }
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.closest?.('.btn-glass') || target?.closest?.('.project-card') || target?.closest?.('.journey-card')) {
        if (!cursorExpandedRef.current) {
          cursorExpandedRef.current = true
          ring.classList.add('expanded')
        }
      }
    }
    const handleOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement
      if (!related?.closest?.('.btn-glass') && !related?.closest?.('.project-card') && !related?.closest?.('.journey-card')) {
        if (cursorExpandedRef.current) {
          cursorExpandedRef.current = false
          ring.classList.remove('expanded')
        }
      }
    }
    document.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver, { passive: true })
    document.addEventListener('mouseout', handleOut, { passive: true })
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
      <a href="#main-content" className="skip-link">Skip to content</a>
      <BackgroundMagnetField />
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <div
        ref={cursorRef}
        className="cursor-ring"
        aria-hidden="true"
      />
      <div ref={panelRef} id="main-content" className="tab-content">
        <div
          data-tab="home"
          className="tab-panel"
        >
          <div className="tab-panel-inner">
            <HomeView onNavigate={handleTabChange} />
          </div>
        </div>
        <div
          data-tab="projects"
          className="tab-panel"
        >
          <div className="tab-panel-inner">
            <section className="section section-compact">
              <ProjectsSection
                data={experience.sections[2]}
                projects={experience.projects}
                isActive={activeTab === 'projects'}
              />
            </section>
          </div>
        </div>
        <div
          data-tab="journey"
          className="tab-panel"
        >
          <div className="tab-panel-inner journey-section-wrapper">
            <JourneyResume />
          </div>
        </div>
        <div
          data-tab="contact"
          className="tab-panel"
        >
          <div className="tab-panel-inner">
            <section className="section section-compact">
              <ContactSection data={experience.sections[3]} contact={experience.contact} />
            </section>
            <Footer />
          </div>
        </div>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default App
