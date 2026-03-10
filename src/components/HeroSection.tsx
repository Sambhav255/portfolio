import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { TextPressure } from './TextPressure'

interface HeroData {
  name: string
  tagline: string
  subline?: string
  subSubline?: string
}

export function HeroSection({ data }: { data: HeroData }) {
  const nameRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const taglineEl = taglineRef.current
    if (!taglineEl) return

    const taglineSplit = new SplitType(taglineEl, { types: 'chars' })
    gsap.set(taglineSplit.chars, { opacity: 0, y: 12 })

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(taglineSplit.chars, { opacity: 1, y: 0, stagger: 0.012, duration: 0.6 })

    return () => {
      taglineSplit.revert()
    }
  }, [data.tagline])

  const pills = data.subline ? data.subline.split(' · ').map((s) => s.trim()) : []

  return (
    <div className="hero-wrapper">
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="hero-availability">
            <span className="hero-availability-dot" />
            AVAILABLE · MAY 2026 · OPEN TO PRODUCT · FINTECH · AI
          </div>
          <h1 ref={nameRef} className="hero-name">
            <TextPressure text={data.name} />
          </h1>
          <p ref={taglineRef} className="hero-tagline">
            {data.tagline}
          </p>
          {pills.length > 0 && (
            <div className="hero-pills">
              {pills.map((p) => (
                <span key={p} className="hero-pill">
                  {p}
                </span>
              ))}
            </div>
          )}
          {data.subSubline && <p className="hero-sub-subline">{data.subSubline}</p>}
        </div>
        <div className="hero-portrait-wrap">
          <div className="hero-portrait-ring">
            {!imgError ? (
              <img
                src="/portrait.jpg"
                alt={data.name}
                className="hero-portrait"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="hero-portrait hero-portrait-fallback" aria-label={data.name}>
                {data.name.split(' ').map(w => w[0]).join('')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
