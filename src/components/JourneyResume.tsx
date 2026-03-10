import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import experience from '../experience.json'

interface JourneyMilestone {
  date: string
  title: string
  impact: string
  lesson: string
}

const MILESTONES = (experience as { journey?: JourneyMilestone[] }).journey ?? []

// Winding vertical path — viewBox 0 0 120 900, 8 milestones
const TRAIL_PATH =
  'M 60 20 C 90 70 30 140 60 200 C 30 260 90 320 60 380 C 90 440 30 500 60 560 C 30 620 90 680 60 740 C 90 800 30 860 60 900'

export function JourneyResume() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [nodePositions, setNodePositions] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    if (MILESTONES.length === 0) return
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3952a87a-600c-469a-8b44-53ba21afdd5b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'initial',
        hypothesisId: 'H3',
        location: 'src/components/JourneyResume.tsx:26',
        message: 'JourneyResume init',
        data: { milestones: MILESTONES.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion agent log
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
          const cardProgress = Math.min(1, Math.max(0, (progress - nodeT * 0.9) / 0.15))
          gsap.set(card, { opacity: cardProgress, y: 20 * (1 - cardProgress) })
        })
      },
    })

    return () => {
      pathDraw.kill()
      ticker.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill()
      })
    }
  }, [])

  useEffect(() => {
    MILESTONES.forEach((_, i) => {
      const card = cardRefs.current[i]
      if (card) gsap.set(card, { opacity: 0, y: 20 })
    })
  }, [])

  if (MILESTONES.length === 0) return null

  return (
    <section ref={sectionRef} className="journey-section" data-section="journey">
      <h2 className="journey-title">JOURNEY</h2>
      <div className="journey-inner" style={{ gridTemplateRows: `repeat(${MILESTONES.length}, minmax(140px, 1fr))` }}>
        <div className="journey-trail-wrap">
          <svg
            className="journey-svg"
            viewBox="0 0 120 900"
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
                <g
                  key={i}
                  transform={`translate(${nodePositions[i]?.x ?? 60}, ${nodePositions[i]?.y ?? 0})`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <circle className="journey-node" r="6" fill="#1A1A2E" />
                  {hoveredIndex === i && (
                    <g className="journey-node-plus">
                      <line x1="-3" y1="0" x2="3" y2="0" stroke="#F7F6F3" strokeWidth="1" strokeLinecap="round" />
                      <line x1="0" y1="-3" x2="0" y2="3" stroke="#F7F6F3" strokeWidth="1" strokeLinecap="round" />
                    </g>
                  )}
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
              className={`journey-card glass ${i % 2 === 0 ? 'journey-card-left' : 'journey-card-right'} ${hoveredIndex === i ? 'journey-card-expanded' : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="journey-card-date">{m.date}</div>
              <h3 className="journey-card-title">{m.title}</h3>
              <p className="journey-card-impact">{m.impact}</p>
              {hoveredIndex === i && (
                <p className="journey-card-lesson">
                  <strong>Product Lesson:</strong> {m.lesson}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
