import { useEffect, useRef } from 'react'

interface TextPressureProps {
  text: string
  className?: string
  /**
   * Radius (in pixels) within which the cursor influences characters.
   */
  maxDistance?: number
}

const FONT_STYLE_ELEMENT_ID = 'text-pressure-variable-font'

function ensureVariableFontInjected() {
  if (typeof document === 'undefined') return
  if (document.getElementById(FONT_STYLE_ELEMENT_ID)) return

  const style = document.createElement('style')
  style.id = FONT_STYLE_ELEMENT_ID

  // Use a variable font that exposes at least wght, wdth and ital axes.
  // This uses Google Fonts' Roboto Flex, which is a rich variable font family.
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');

    .text-pressure-font {
      font-family: 'Roboto Flex', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.32em;
      font-variation-settings: "wght" 250, "wdth" 105, "ital" 0;
      font-feature-settings: "ss01" on, "ss02" on;
    }
  `

  document.head.appendChild(style)
}

export function TextPressure({ text, className, maxDistance = 220 }: TextPressureProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const centersRef = useRef<{ x: number; y: number }[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    ensureVariableFontInjected()
  }, [])

  // Measure character bounding boxes
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      centersRef.current = charRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 }
        const rect = el.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
      })
    }

    // Initial measure
    const raf = requestAnimationFrame(measure)

    // Re-measure on resize since layout may change
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [text])

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    const isTouchDevice = window.matchMedia?.('(hover: none)').matches
    if (isTouchDevice) return

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY }
      if (rafIdRef.current == null) {
        rafIdRef.current = requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      const mouse = mouseRef.current
      const chars = charRefs.current
      const centers = centersRef.current

      if (!mouse || chars.length === 0 || centers.length === 0) {
        rafIdRef.current = null
        return
      }

      const maxD = maxDistance

      for (let i = 0; i < chars.length; i++) {
        const el = chars[i]
        const center = centers[i]
        if (!el || !center) continue

        const dx = center.x - mouse.x
        const dy = center.y - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        const clamped = Math.max(0, Math.min(1, 1 - distance / maxD))

        // Map proximity to font variation axes:
        // Closer = heavier, wider, more italic.
        const weight = 200 + clamped * (900 - 200) // 200 → 900
        const width = 75 + clamped * (110 - 75) // 75% → 110%
        const ital = clamped // 0 → 1

        el.style.fontVariationSettings = `"wght" ${weight.toFixed(
          1
        )}, "wdth" ${width.toFixed(1)}, "ital" ${ital.toFixed(2)}`
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [maxDistance])

  // Reset styles when text changes
  useEffect(() => {
    charRefs.current.forEach((el) => {
      if (!el) return
      el.style.fontVariationSettings = `"wght" 250, "wdth" 105, "ital" 0`
    })
  }, [text])

  const characters = Array.from(text)

  return (
    <span
      ref={containerRef}
      className={['text-pressure-font', className].filter(Boolean).join(' ')}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(el) => {
            charRefs.current[index] = el
          }}
          style={{
            display: 'inline-block',
            transition: 'font-variation-settings 0.1s ease-out',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

