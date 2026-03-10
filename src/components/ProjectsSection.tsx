import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  tags: string[]
}

function ProjectCard({ p, featured }: { p: Project; featured?: boolean }) {
  return (
    <a
      href={p.link}
      className={`project-card ${featured ? 'project-card-featured' : ''}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3>{p.name}</h3>
      <p className="one-liner">{p.oneLiner}</p>
      <p className="description">{p.description}</p>
      <div className="tags">
        {p.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </a>
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
    gsap.registerPlugin(ScrollTrigger)
    const titleEl = titleRef.current
    const bodyEl = bodyRef.current
    const cardsEl = cardsRef.current
    if (!titleEl) return

    const titleSplit = new SplitType(titleEl, { types: 'chars' })
    gsap.set(titleSplit.chars, { opacity: 0, y: 20 })
    gsap.to(titleSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.02,
      scrollTrigger: {
        trigger: titleEl.closest('.section'),
        start: 'top 70%',
        scrub: 0.5,
      },
    })
    if (bodyEl && data.body) {
      gsap.fromTo(
        bodyEl,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: bodyEl.closest('.section'),
            start: 'top 62%',
            scrub: 0.5,
          },
        }
      )
    }
    if (cardsEl) {
      gsap.fromTo(
        cardsEl.children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.5,
          scrollTrigger: {
            trigger: cardsEl,
            start: 'top 85%',
            scrub: 0.4,
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger && sectionRef.current?.contains(t.trigger)) t.kill()
      })
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
