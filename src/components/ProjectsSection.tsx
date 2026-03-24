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
  logo?: string
  prdUrl?: string
  featured?: boolean
  flagship?: boolean
  projectContext?: string
  detailedDescription?: string[]
}

function ProjectCard({ p, featured, onOpen }: { p: Project; featured?: boolean; onOpen: () => void }) {
  const hasDetailed = p.detailedDescription && p.detailedDescription.length > 0

  return (
    <div className={`project-card magnetic-el ${featured ? 'project-card-featured' : ''} ${p.flagship ? 'project-card-flagship' : ''}`}>
      <button type="button" className="project-card-link project-card-button" onClick={onOpen}>
        <div className="project-title-row">
          {'logo' in p && p.logo && (
            <img src={p.logo} alt="Ruta'al logo" className="project-logo" />
          )}
          <h3>{p.name}</h3>
        </div>
        <p className="one-liner">{p.oneLiner}</p>
        {p.projectContext && (
          <p className="project-context">{p.projectContext}</p>
        )}
        {hasDetailed ? (
          p.detailedDescription!.map((html, i) => (
            <p key={i} className="description" dangerouslySetInnerHTML={{ __html: html }} />
          ))
        ) : (
          <p className="description">{p.description}</p>
        )}
      </button>
      {p.prdUrl && p.prdUrl !== '#' && !hasDetailed && (
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

  const mainProjects = projects.filter((p) => p.featured === true)
  const otherProjects = projects.filter((p) => !p.featured)
  const [firstFeatured, ...restFeatured] = mainProjects

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
        {firstFeatured && <ProjectCard p={firstFeatured} featured onOpen={() => setActiveProject(firstFeatured)} />}
        {restFeatured.map((p) => (
          <ProjectCard key={p.name} p={p} onOpen={() => setActiveProject(p)} />
        ))}
      </div>
      <div className="other-work-card-wrap">
        <div className="other-work-grid">
          {otherProjects.length > 0 && (
            <div className="other-work-card" key={otherProjects[0].name}>
              <div className="other-work-label">OTHER WORK</div>
              <h4 className="other-work-title">{otherProjects[0].name}</h4>
              <p className="other-work-text">{otherProjects[0].description}</p>
              {otherProjects[0].link && otherProjects[0].link !== '#' && (
                <a href={otherProjects[0].link} target="_blank" rel="noopener noreferrer" className="other-work-link">
                  View demo →
                </a>
              )}
            </div>
          )}
          <div className="other-work-card">
            <div className="other-work-label">UNIVERSITY RESEARCH · R · DATA ANALYTICS</div>
            <h4 className="other-work-title">Equity in EV Infrastructure</h4>
            <p className="other-work-text">
              Built a multi-variable correlation analysis in R linking EV ownership, vehicle cost, charger density, and income across Twin Cities ZIP codes — surfacing infrastructure mismatches and presenting equity-focused siting recommendations at a university data competition.
            </p>
            <a href="/datacom_poster.pdf" target="_blank" rel="noopener noreferrer" className="other-work-link">
              View research poster →
            </a>
          </div>
        </div>
      </div>
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
            doDifferently: activeProject.doDifferently,
          }}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  )
}
