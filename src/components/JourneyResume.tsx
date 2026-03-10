import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MILESTONES = [
  {
    date: '19 Years',
    title: 'Kathmandu',
    impact: 'Born and raised with the Himalayas as a backdrop',
    lesson: 'Roots shape perspective—authenticity starts at home.',
  },
  {
    date: 'Age 13',
    title: 'Family Dealership',
    impact: 'Ground-level education in financial operations at Bajaj showroom',
    lesson: 'Understand the unit economics before scaling.',
  },
  {
    date: 'Aug 2022',
    title: 'The Move',
    impact: 'Relocated to the US for college at University of St. Thomas',
    lesson: 'Adaptation is the first step to impact.',
  },
  {
    date: 'Aug 2022',
    title: 'Yardstick Election',
    impact: 'Elected 1st international student Class President (1,600 constituents)',
    lesson: 'Build trust by showing up when no one knows your name.',
  },
  {
    date: 'Mar 2023',
    title: 'VR Product Developer',
    impact: 'Led STELAR VR Lab initiatives for 250+ students',
    lesson: 'Scaling impact through documentation and repeatable workflows.',
  },
  {
    date: 'Nov 2023',
    title: 'Wilt & Water',
    impact: 'Won $1,500 at Fowler Business Concept Challenge',
    lesson: 'Sustainability ventures need clear unit economics.',
  },
  {
    date: 'Spring 2024',
    title: 'London Study Abroad',
    impact: 'Designed scalable literacy guides for 75+ users at Kilburn Library',
    lesson: 'Scaling impact through documentation.',
  },
  {
    date: 'Jun 2024 – Jun 2025',
    title: 'Quant Research',
    impact: 'Developed trading APIs and 75+ backtests at CAM',
    lesson: 'Data-driven decisions beat intuition at scale.',
  },
  {
    date: 'Aug 2025',
    title: 'LEAF Lab PM Fellow',
    impact: 'Managing product backlogs and sprint planning for AI EdTech',
    lesson: 'Prioritization is the core PM skill.',
  },
  {
    date: 'Fall 2025',
    title: 'Perplexity Strategist',
    impact: 'Selected for Campus Strategist Program for AI adoption',
    lesson: 'Iterate messaging for different audiences.',
  },
  {
    date: 'Oct 2025',
    title: "Ruta'al Launch",
    impact: 'Won $6,000 for USSD fintech serving unbanked workers',
    lesson: 'Financial inclusion starts with understanding the unbanked.',
  },
]

// Winding vertical path — viewBox 0 0 120 1100
const TRAIL_PATH =
  'M 60 20 C 90 80 30 160 60 220 C 30 280 90 360 60 420 C 90 480 30 560 60 620 C 30 680 90 760 60 820 C 90 880 30 960 60 1020 C 30 1080 60 1100'

export function JourneyResume({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [nodePositions, setNodePositions] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const path = pathRef.current
    const section = sectionRef.current
    if (!path || !section) return

    const totalLen = path.getTotalLength()
    path.style.strokeDasharray = `${totalLen}`
    gsap.set(path, { strokeDashoffset: totalLen })

    setNodePositions(
      MILESTONES.map((_, i) => {
        const t = i / Math.max(1, MILESTONES.length - 1)
        const pt = path.getPointAtLength(t * totalLen)
        return { x: pt.x, y: pt.y }
      })
    )

    const pathDraw = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 30%',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    })

    const ticker = ScrollTrigger.create({
      trigger: section,
      start: 'top 30%',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress
        MILESTONES.forEach((_, i) => {
          const card = cardRefs.current[i]
          if (!card) return
          const nodeT = i / Math.max(1, MILESTONES.length - 1)
          const cardProgress = Math.min(1, Math.max(0, (progress - nodeT * 0.9) / 0.12))
          gsap.set(card, { opacity: cardProgress, y: 20 * (1 - cardProgress) })
        })
      },
    })

    const visibilityTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => onVisibilityChange?.(true),
      onLeaveBack: () => onVisibilityChange?.(false),
      onLeave: () => onVisibilityChange?.(false),
      onEnterBack: () => onVisibilityChange?.(true),
    })

    return () => {
      pathDraw.kill()
      ticker.kill()
      visibilityTrigger.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill()
      })
    }
  }, [onVisibilityChange])

  useEffect(() => {
    MILESTONES.forEach((_, i) => {
      const card = cardRefs.current[i]
      if (card) gsap.set(card, { opacity: 0, y: 20 })
    })
  }, [])

  return (
    <section ref={sectionRef} className="journey-section" data-section="journey">
      <h2 className="journey-title">JOURNEY</h2>
      <div className="journey-inner">
        <div className="journey-trail-wrap">
          <svg
            className="journey-svg"
            viewBox="0 0 120 1100"
            preserveAspectRatio="xMidYMin meet"
          >
            <path
              ref={pathRef}
              className="journey-path"
              d={TRAIL_PATH}
              fill="none"
              stroke="#1A1A2E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {nodePositions.length > 0 &&
              MILESTONES.map((_, i) => (
                <g key={i} transform={`translate(${nodePositions[i]?.x ?? 60}, ${nodePositions[i]?.y ?? 0})`}>
                  <circle
                    className="journey-node"
                    r="6"
                    fill="#1A1A2E"
                    onMouseEnter={() => setExpandedIndex(i)}
                    onMouseLeave={() => setExpandedIndex(null)}
                  />
                </g>
              ))}
          </svg>
        </div>
        <div className="journey-cards">
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className={`journey-card glass ${i % 2 === 0 ? 'journey-card-left' : 'journey-card-right'} ${expandedIndex === i ? 'journey-card-expanded' : ''}`}
              onMouseEnter={() => setExpandedIndex(i)}
              onMouseLeave={() => setExpandedIndex(null)}
            >
              <div className="journey-card-date">{m.date}</div>
              <h3 className="journey-card-title">{m.title}</h3>
              <p className="journey-card-impact">{m.impact}</p>
              {expandedIndex === i && (
                <p className="journey-card-lesson">{m.lesson}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
