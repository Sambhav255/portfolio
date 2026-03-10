import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

interface SectionData {
  title: string
  body: string
}

interface AboutStat {
  value: string
  label: string
}

interface AboutData {
  bullets: string[]
  stats?: AboutStat[]
}

export function FinanceVRSection({
  data,
  about,
}: {
  data: SectionData
  about: AboutData
}) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const titleEl = titleRef.current
    const bodyEl = bodyRef.current
    if (!titleEl || !bodyEl) return

    const titleSplit = new SplitType(titleEl, { types: 'chars' })
    const bodySplit = new SplitType(bodyEl, { types: 'words' })
    gsap.set(titleSplit.chars, { opacity: 0, y: 20 })
    gsap.set(bodySplit.words, { opacity: 0, y: 14 })

    gsap.to(titleSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.6,
      scrollTrigger: {
        trigger: titleEl.closest('.section'),
        start: 'top 70%',
        end: 'top 40%',
        scrub: 0.6,
      },
    })
    gsap.to(bodySplit.words, {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      duration: 0.5,
      scrollTrigger: {
        trigger: bodyEl.closest('.section'),
        start: 'top 65%',
        end: 'top 35%',
        scrub: 0.5,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger && sectionRef.current?.contains(t.trigger)) t.kill()
      })
      titleSplit.revert()
      bodySplit.revert()
    }
  }, [data.title, data.body])

  const stats = about?.stats ?? []

  return (
    <div ref={sectionRef} className="about-layout">
      <div className="glass about-card">
        <h2 ref={titleRef} className="section-title">
          {data.title}
        </h2>
        <p ref={bodyRef} className="section-body">
          {data.body}
        </p>
      </div>
      {stats.length > 0 && (
        <div className="about-stats">
          {stats.map((s, i) => (
            <div key={i} className="about-stat">
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
