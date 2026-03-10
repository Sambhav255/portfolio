import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

interface SectionData {
  title: string
  body: string
}

interface ContactData {
  headline: string
  cta: string
  email: string
  linkedin: string
  resumeUrl: string
}

export function ContactSection({
  data: _data,
  contact,
}: {
  data: SectionData
  contact: ContactData
}) {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const headlineEl = headlineRef.current
    const subEl = subRef.current
    if (!headlineEl || !subEl) return

    const headlineSplit = new SplitType(headlineEl, { types: 'chars' })
    gsap.set(headlineSplit.chars, { opacity: 0, y: 16 })
    gsap.set(subEl, { opacity: 0, y: 12 })
    gsap.to(headlineSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.02,
      scrollTrigger: { trigger: headlineEl.closest('.section'), start: 'top 70%', scrub: 0.5 },
    })
    gsap.to(subEl, {
      opacity: 1,
      y: 0,
      scrollTrigger: { trigger: subEl.closest('.section'), start: 'top 65%', scrub: 0.5 },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger && sectionRef.current?.contains(t.trigger)) t.kill()
      })
      headlineSplit.revert()
    }
  }, [contact.headline])

  return (
    <div ref={sectionRef} className="contact-inner">
      <h2 ref={headlineRef} className="contact-headline">
        Let's build something.
      </h2>
      <p ref={subRef} className="contact-sub">
        {contact.headline}
      </p>
      <div className="contact-buttons">
        <a href={contact.email.startsWith('mailto:') ? contact.email : `mailto:${contact.email}`} className="btn-glass">
          {contact.cta}
        </a>
        <a href={contact.linkedin} className="btn-glass" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        {contact.resumeUrl && contact.resumeUrl !== '#' && (
          <a href={contact.resumeUrl} className="btn-glass" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        )}
      </div>
    </div>
  )
}
