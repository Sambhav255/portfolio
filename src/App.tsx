import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './hooks/useLenis'
import { Scene } from './components/Scene'
import { HeroSection } from './components/HeroSection'
import { FinanceVRSection } from './components/FinanceVRSection'
import { ProjectsSection } from './components/ProjectsSection'
import { JourneyResume } from './components/JourneyResume'
import { ContactSection } from './components/ContactSection'
import experience from './experience.json'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useLenis()
  const scrollProgressRef = useRef(0)
  const morphProgressRef = useRef(0)
  const journeyGlowRef = useRef(0)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [cursorExpanded, setCursorExpanded] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aboutSection = document.querySelector('[data-section="1"]')
    const projectsSection = document.querySelector('[data-section="2"]')

    const aboutTrigger =
      aboutSection &&
      ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top center',
        end: 'bottom center',
      })
    const projectsTrigger =
      projectsSection &&
      ScrollTrigger.create({
        trigger: projectsSection,
        start: 'top center',
        end: 'bottom center',
      })

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
        const ap = aboutTrigger?.progress ?? 0
        const pp = projectsTrigger?.progress ?? 0
        morphProgressRef.current = pp > 0.01 ? 1 - pp : ap
      },
    })

    return () => {
      aboutTrigger?.kill()
      projectsTrigger?.kill()
      st.kill()
    }
  }, [])

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
      <Scene scrollProgressRef={scrollProgressRef} morphProgressRef={morphProgressRef} journeyGlowRef={journeyGlowRef} />
      <div
        ref={cursorRef}
        className={`cursor-ring ${cursorExpanded ? 'expanded' : ''}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
        aria-hidden="true"
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <section className="section" data-section="0">
          <HeroSection data={experience.hero} />
        </section>
        <hr className="section-divider" />
        <section className="section" data-section="1">
          <FinanceVRSection data={experience.sections[1]} about={experience.about} />
        </section>
        <hr className="section-divider" />
        <section className="section journey-section-wrapper" data-section="journey">
          <JourneyResume
            onVisibilityChange={(visible) => {
              journeyGlowRef.current = visible ? 1 : 0
            }}
          />
        </section>
        <hr className="section-divider" />
        <section className="section" data-section="2">
          <ProjectsSection data={experience.sections[2]} projects={experience.projects} />
        </section>
        <hr className="section-divider" />
        <section className="section" data-section="3">
          <ContactSection data={experience.sections[3]} contact={experience.contact} />
        </section>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default App
