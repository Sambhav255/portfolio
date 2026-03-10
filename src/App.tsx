import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from './hooks/useLenis'
import { Scene } from './components/Scene'
import { HeroSection } from './components/HeroSection'
import { FinanceVRSection } from './components/FinanceVRSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'
import experience from './experience.json'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useLenis()
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
      },
    })
    return () => st.kill()
  }, [])

  return (
    <>
      <Scene scrollProgressRef={scrollProgressRef} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <section className="section" data-section="0">
          <HeroSection data={experience.hero} />
        </section>
        <hr className="section-divider" />
        <section className="section" data-section="1">
          <FinanceVRSection data={experience.sections[1]} about={experience.about} />
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
