import { useEffect, useRef } from 'react'
import gsap from 'gsap'
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
  basedIn?: string
  relocation?: string
  available?: string
  currently?: string
  openTo?: string
}

export function ContactSection({
  contact,
}: {
  data: SectionData
  contact: ContactData
}) {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const headlineEl = headlineRef.current
    const subEl = subRef.current
    if (!headlineEl || !subEl) return

    const headlineSplit = new SplitType(headlineEl, { types: 'chars' })
    gsap.set(headlineSplit.chars, { opacity: 0, y: 16 })
    gsap.set(subEl, { opacity: 0, y: 12 })
    const tl = gsap.timeline({ delay: 0.1 })
    tl.to(headlineSplit.chars, { opacity: 1, y: 0, stagger: 0.02, duration: 0.5 })
    tl.to(subEl, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')

    return () => {
      headlineSplit.revert()
    }
  }, [contact.headline])

  const rawEmail = contact.email ?? ''
  const emailAddr = rawEmail.replace(/^mailto:/i, '')
  const mailtoHref = rawEmail.startsWith('mailto:') ? rawEmail : (emailAddr ? `mailto:${emailAddr}` : 'mailto:lami9190@stthomas.edu')

  return (
    <div className="contact-inner">
      <div className="contact-availability">
        <span className="availability-dot" />
        Currently open to product &amp; data roles.
      </div>
      <h2 ref={headlineRef} className="contact-headline">
        Let&apos;s build something.
      </h2>
      <p ref={subRef} className="contact-sub">
        {contact.headline}
      </p>
      <p className="contact-response">Response time: usually within 24 hours.</p>
      <p className="contact-email-text">{emailAddr}</p>
      <div className="contact-buttons">
        <a
          href={mailtoHref}
          className="btn-contact-primary magnetic-el"
          title={`Email ${emailAddr}`}
        >
          {contact.cta}
        </a>
        <a href={contact.linkedin} className="btn-contact-secondary magnetic-el" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        {contact.resumeUrl && contact.resumeUrl !== '#' && (
          <a href={contact.resumeUrl} className="btn-contact-secondary magnetic-el" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        )}
      </div>
      {(contact.basedIn || contact.relocation || contact.available || contact.currently || contact.openTo) && (
        <div className="contact-info-strip">
          <div className="contact-info-col">
            {(contact.basedIn || contact.relocation) && (
              <div className="contact-info-item">
                <div className="contact-info-label">BASED IN</div>
                {contact.basedIn && <div className="contact-info-value">{contact.basedIn}</div>}
                {contact.relocation && <div className="contact-info-value contact-info-value-relocation">{contact.relocation}</div>}
              </div>
            )}
            {contact.available && (
              <div className="contact-info-item">
                <div className="contact-info-label">AVAILABLE</div>
                <div className="contact-info-value">{contact.available}</div>
              </div>
            )}
          </div>
          <div className="contact-info-col">
            {contact.currently && (
              <div className="contact-info-item">
                <div className="contact-info-label">CURRENTLY</div>
                <div className="contact-info-value">{contact.currently}</div>
              </div>
            )}
            {contact.openTo && (
              <div className="contact-info-item">
                <div className="contact-info-label">OPEN TO</div>
                <div className="contact-info-value">{contact.openTo}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
