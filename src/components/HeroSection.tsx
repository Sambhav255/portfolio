import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

interface HeroData {
  name: string
  tagline: string
  subline?: string
  subSubline?: string
}

export function HeroSection({ data }: { data: HeroData }) {
  const nameRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const nameEl = nameRef.current
    const taglineEl = taglineRef.current
    if (!nameEl || !taglineEl) return

    const nameSplit = new SplitType(nameEl, { types: 'words' })
    const taglineSplit = new SplitType(taglineEl, { types: 'chars' })
    gsap.set(nameSplit.words, { opacity: 0, y: 24 })
    gsap.set(taglineSplit.chars, { opacity: 0, y: 12 })

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(nameSplit.words, { opacity: 1, y: 0, stagger: 0.12, duration: 1 })
    tl.to(taglineSplit.chars, { opacity: 1, y: 0, stagger: 0.012, duration: 0.6 }, '-=0.4')

    return () => {
      nameSplit.revert()
      taglineSplit.revert()
    }
  }, [data.name, data.tagline])

  const pills = data.subline ? data.subline.split(' · ').map((s) => s.trim()) : []
  const taglineParts = data.tagline.split(/(\bfinance\b)/i)

  return (
    <div className="hero-wrapper">
      <div className="hero-layout">
        <div className="hero-copy">
        <h1 ref={nameRef} className="hero-name">
          {data.name}
        </h1>
        <p ref={taglineRef} className="hero-tagline">
          {taglineParts.map((part, i) =>
            /finance/i.test(part) ? (
              <span key={i} className="accent">
                {part}
              </span>
            ) : (
              part
            )
          )}
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
          <img src="/portrait.jpg" alt="Sambhav Lamichhane" className="hero-portrait" />
        </div>
      </div>
    </div>
  )
}
