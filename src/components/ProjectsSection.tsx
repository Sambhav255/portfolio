import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SplitType from 'split-type'
import { ProjectModal, type ProjectDetails } from './ProjectModal'

interface SectionData {
  title: string
  body: string
}

interface Project extends ProjectDetails {
  link: string
  prdUrl?: string
}

function ProjectCard({ p, featured, onOpen }: { p: Project; featured?: boolean; onOpen: () => void }) {
  const isRutaal = p.name.toLowerCase().includes("ruta'al")
  const isVibeTicker = p.name.toLowerCase().includes('vibeticker')
  const isCardSense = p.name.toLowerCase().includes('cardsense')

  return (
    <div className={`project-card magnetic-el ${featured ? 'project-card-featured' : ''} ${isRutaal ? 'project-card-flagship' : ''}`}>
      <button type="button" className="project-card-link project-card-button" onClick={onOpen}>
        <h3>{p.name}</h3>
        {isRutaal && (
          <>
            <p className="one-liner">Co-founded USSD fintech for unbanked workers in Mexico and Nepal.</p>
            <p className="project-context">
              USSD-based fintech · Mexico &amp; Nepal · $6,000 won · Functional prototype built
            </p>
            <p className="description"><strong>The problem:</strong> 250 million informal workers in Mexico and Nepal operate entirely outside the formal financial system. No credit score. No bank account. No safety net.</p>
            <p className="description"><strong>What I built:</strong> A USSD-based fintech platform requiring zero smartphone or internet access. Built the functional prototype, defined the technical architecture, and led investor pitches.</p>
            <p className="description"><strong>How I validated it:</strong> Conducted TAM/SAM/SOM analysis across two emerging markets. Won $6,000 across business competitions. Refined unit economics through three rounds of judge feedback.</p>
            <p className="description"><strong>What I'd do differently:</strong> I'd invest earlier in agent network partnerships before building the technology — distribution is harder than the product in emerging markets.</p>
          </>
        )}
        {isVibeTicker && (
          <>
            <p className="one-liner">Real-time sentiment vs. price dashboard for retail investors.</p>
            <p className="project-context">
              TypeScript · Gemini API · Real-time sentiment vs. price data
            </p>
            <p className="description"><strong>The problem:</strong> Retail investors react to news headlines without any structured way to correlate sentiment with actual price movement in real time.</p>
            <p className="description"><strong>What I built:</strong> A TypeScript dashboard that pulls live Gemini-analyzed news sentiment and maps it against equity, ETF, and crypto price data via server-side API integration.</p>
            <p className="description"><strong>Technical decision I made:</strong> Chose server-side API calls over client-side to avoid exposing API keys and reduce latency — a tradeoff between security and build complexity.</p>
            <p className="description"><strong>Status:</strong> Live on Vercel. <a href={p.link} target="_blank" rel="noopener noreferrer">View VibeTicker</a></p>
          </>
        )}
        {isCardSense && (
          <>
            <p className="one-liner">AI-powered credit card optimizer for everyday spend.</p>
            <p className="project-context">
              React · Gemini API · Deployed on Vercel
            </p>
            <p className="description"><strong>The problem:</strong> Most people use one or two credit cards out of habit, leaving hundreds of dollars in annual rewards on the table.</p>
            <p className="description"><strong>What I built:</strong> Full-stack React app using Gemini API to analyze transaction patterns and calculate opportunity cost across 15+ card products.</p>
            <p className="description"><strong>Key product decision:</strong> Designed the output as an “annual opportunity cost” figure rather than a reward comparison — framing it as money lost rather than money gained tested better with users.</p>
            <p className="description"><strong>Status:</strong> Live on Vercel. <a href={p.link} target="_blank" rel="noopener noreferrer">View CardSense</a></p>
          </>
        )}
        {!isRutaal && !isVibeTicker && !isCardSense && (
          <>
            <p className="one-liner">{p.oneLiner}</p>
            <p className="description">{p.description}</p>
          </>
        )}
      </button>
      {p.prdUrl && p.prdUrl !== '#' && !isRutaal && !isVibeTicker && !isCardSense && (
        <a
          href={p.prdUrl}
          className="btn-glass btn-prd magnetic-el"
          target="_blank"
          rel="noopener noreferrer"
        >
          View PRD
        </a>
      )}
      <div className="tags">
        {p.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProjectsSection({
  data,
  projects,
  isActive,
}: {
  data: SectionData
  projects: Project[]
  isActive: boolean
}) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const titleEl = titleRef.current
    const bodyEl = bodyRef.current
    const cardsEl = cardsRef.current
    if (!titleEl) return

    const titleSplit = new SplitType(titleEl, { types: 'chars' })

    const reset = () => {
      gsap.set(titleSplit.chars, { opacity: 0, y: 20 })
      if (bodyEl) gsap.set(bodyEl, { opacity: 0, y: 12 })
      if (cardsEl) gsap.set(cardsEl.children, { opacity: 0, y: 24 })
    }

    reset()

    if (!isActive) {
      return () => {
        titleSplit.revert()
      }
    }

    const tl = gsap.timeline({ delay: 0.1 })
    tl.to(titleSplit.chars, { opacity: 1, y: 0, stagger: 0.02, duration: 0.5 })
    if (bodyEl && data.body) {
      tl.to(bodyEl, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
    }
    if (cardsEl) {
      tl.to(cardsEl.children, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, '-=0.2')
    }

    return () => {
      tl.kill()
      titleSplit.revert()
    }
  }, [data, projects, isActive])

  const mainProjects = projects.filter((p) =>
    ["ruta'al — financial inclusion platform", 'vibeticker — market sentiment dashboard', 'cardsense — ai credit card optimizer']
      .includes(p.name.toLowerCase())
  )
  const otherProjects = projects.filter((p) => !mainProjects.includes(p))
  const [featured, ...rest] = mainProjects

  return (
    <div ref={sectionRef} className="projects-inner">
      <h2 ref={titleRef} className="section-title">
        {data.title}
      </h2>
      {data.body ? (
        <p ref={bodyRef} className="section-body" style={{ marginBottom: '2rem' }}>
          {data.body}
        </p>
      ) : null}
      <div ref={cardsRef} className="projects-grid">
        {featured && <ProjectCard p={featured} featured onOpen={() => setActiveProject(featured)} />}
        {rest.map((p) => (
          <ProjectCard key={p.name} p={p} onOpen={() => setActiveProject(p)} />
        ))}
      </div>
      {otherProjects.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 className="home-story-title">Other work</h3>
          <ul className="section-body" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
            {otherProjects.map((p) => (
              <li key={p.name}>
                <strong>{p.name}</strong> — {p.oneLiner}{' '}
                {p.link && p.link !== '#' && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeProject && (
        <ProjectModal
          project={{
            name: activeProject.name,
            oneLiner: activeProject.oneLiner,
            description: activeProject.description,
            tags: activeProject.tags,
            demoUrl: activeProject.demoUrl,
            repoUrl: activeProject.repoUrl,
            pitchDeckUrl: activeProject.pitchDeckUrl,
            results: activeProject.results,
            why: activeProject.why,
          }}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  )
}
