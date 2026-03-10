import { useEffect, useMemo, useRef, useCallback } from 'react'
import gsap from 'gsap'

export interface ProjectDetails {
  name: string
  oneLiner: string
  description: string
  tags: string[]
  demoUrl?: string
  repoUrl?: string
  pitchDeckUrl?: string
  results?: string[]
  why?: string
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectDetails
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const actions = useMemo(() => {
    const a: { label: string; url?: string }[] = [
      { label: 'Demo', url: project.demoUrl },
      { label: 'Pitch Deck', url: project.pitchDeckUrl },
      { label: 'Repo', url: project.repoUrl },
    ]
    return a.filter((x) => x.url && x.url !== '#')
  }, [project.demoUrl, project.pitchDeckUrl, project.repoUrl])

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay || !card) {
      onClose()
      return
    }
    gsap.to(card, {
      opacity: 0,
      scale: 0.96,
      y: 8,
      duration: 0.2,
      ease: 'power2.in',
    })
    gsap.to(overlay.querySelector('.modal-backdrop')!, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }, [onClose])

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement

    const overlay = overlayRef.current
    const card = cardRef.current
    if (overlay && card) {
      gsap.fromTo(
        overlay.querySelector('.modal-backdrop')!,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.96, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out', delay: 0.05 }
      )
    }

    const closeBtn = card?.querySelector('.modal-close') as HTMLElement
    closeBtn?.focus()

    return () => {
      previousFocusRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()

      if (e.key === 'Tab') {
        const card = cardRef.current
        if (!card) return
        const focusable = card.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleClose])

  return (
    <div ref={overlayRef} className="modal-overlay" role="dialog" aria-modal="true" aria-label={project.name}>
      <div className="modal-backdrop" onMouseDown={handleClose} />
      <div ref={cardRef} className="modal-card glass" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <div className="modal-kicker">Project</div>
            <h3 className="modal-title">{project.name}</h3>
            <div className="modal-sub">{project.oneLiner}</div>
          </div>
          <button className="modal-close btn-glass magnetic-el" onClick={handleClose}>
            Close
          </button>
        </div>

        {actions.length > 0 && (
          <div className="modal-actions">
            {actions.map((a) => (
              <a key={a.label} href={a.url} className="btn-glass magnetic-el" target="_blank" rel="noopener noreferrer">
                {a.label}
              </a>
            ))}
          </div>
        )}

        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-section-title">Overview</div>
            <div className="modal-text">{project.description}</div>
          </div>

          {project.why && (
            <div className="modal-section">
              <div className="modal-section-title">Why it exists</div>
              <div className="modal-text">{project.why}</div>
            </div>
          )}

          {project.results && project.results.length > 0 && (
            <div className="modal-section">
              <div className="modal-section-title">Results</div>
              <ul className="modal-list">
                {project.results.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {project.tags?.length ? (
            <div className="modal-tags">
              {project.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
