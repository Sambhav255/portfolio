import React, { useRef, useEffect, CSSProperties } from 'react'

export interface MagnetLinesProps {
  rows?: number
  columns?: number
  containerSize?: string
  lineColor?: string
  lineWidth?: string
  lineHeight?: string
  baseAngle?: number
  className?: string
  style?: CSSProperties
}

export const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 9,
  columns = 9,
  containerSize = '80vmin',
  lineColor = '#D4D0C8',
  lineWidth = '1px',
  lineHeight = '40px',
  baseAngle = -10,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll<HTMLSpanElement>('span')
    let frameId: number | null = null
    let lastPointer: { x: number; y: number } | null = null

    const update = () => {
      frameId = null
      if (!lastPointer) return
      const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.45
      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const b = lastPointer!.x - centerX
        const a = lastPointer!.y - centerY
        const c = Math.sqrt(a * a + b * b) || 1
        const r = ((Math.acos(b / c) * 180) / Math.PI) * (lastPointer!.y > centerY ? 1 : -1)
        item.style.setProperty('--rotate', `${r}deg`)

        const dist = Math.min(c, maxDist)
        const t = dist / maxDist
        const alpha = 0.7 - 0.4 * t // near: 0.7, far: 0.3
        item.style.backgroundColor = `rgba(212, 208, 200, ${alpha.toFixed(2)})`
      })
    }

    const handlePointerMove = (e: PointerEvent) => {
      lastPointer = { x: e.clientX, y: e.clientY }
      if (frameId == null) {
        frameId = requestAnimationFrame(update)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    // Trigger a first layout based on center of screen
    lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    frameId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frameId != null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const total = rows * columns

  const spans = Array.from({ length: total }, (_, i) => {
    const scale = 0.7 + Math.random() * 0.6 // ±30%
    return (
      <span
        key={i}
        className="magnet-line-cell"
        style={
          {
            backgroundColor: lineColor,
            width: lineWidth,
            height: `calc(${lineHeight} * ${scale.toFixed(2)})`,
            // @ts-expect-error custom property
            '--rotate': `${baseAngle}deg`,
            transform: 'rotate(var(--rotate))',
            willChange: 'transform',
          } as React.CSSProperties
        }
      />
    )
  })

  return (
    <div
      ref={containerRef}
      className={['magnet-lines-grid', className].filter(Boolean).join(' ')}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style,
      }}
    >
      {spans}
    </div>
  )
}

