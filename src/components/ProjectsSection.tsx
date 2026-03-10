import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitType from 'split-type'

interface SectionData {
  title: string
  body: string
}

interface Project {
  name: string
  oneLiner: string
  description: string
  link: string
  prdUrl?: string
  tags: string[]
}

function ProjectCard({ p, featured }: { p: Project; featured?: boolean }) {
  return (
    <div className={`project-card magnetic-el ${featured ? 'project-card-featured' : ''}`}>
      <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-card-link">
        <h3>{p.name}</h3>
        <p className="one-liner">{p.oneLiner}</p>
        <p className="description">{p.description}</p>
      </a>
      {p.prdUrl && (
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
}: {
  data: SectionData
  projects: Project[]
}) {
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
    gsap.set(titleSplit.chars, { opacity: 0, y: 20 })
    const tl = gsap.timeline({ delay: 0.1 })
    tl.to(titleSplit.chars, { opacity: 1, y: 0, stagger: 0.02, duration: 0.5 })
    if (bodyEl && data.body) {
      gsap.set(bodyEl, { opacity: 0, y: 12 })
      tl.to(bodyEl, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
    }
    if (cardsEl) {
      gsap.set(cardsEl.children, { opacity: 0, y: 24 })
      tl.to(cardsEl.children, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, '-=0.2')
    }

    return () => {
      titleSplit.revert()
    }
  }, [data, projects])

  const [featured, ...rest] = projects

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
        {featured && <ProjectCard p={featured} featured />}
        {rest.map((p) => (
          <ProjectCard key={p.name} p={p} />
        ))}
      </div>
    </div>
  )
}
