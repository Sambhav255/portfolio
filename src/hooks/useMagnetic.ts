import { useEffect } from 'react'

const MAGNET_RADIUS = 50
const MAGNET_STRENGTH = 0.15

export function useMagnetic() {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      document.querySelectorAll('.magnetic-el').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > MAGNET_RADIUS) {
          ;(el as HTMLElement).style.transform = ''
          return
        }
        const t = 1 - dist / MAGNET_RADIUS
        const pullX = dx * MAGNET_STRENGTH * t
        const pullY = dy * MAGNET_STRENGTH * t
        ;(el as HTMLElement).style.transform = `translate(${pullX}px, ${pullY}px)`
      })
    }
    const handleLeave = () => {
      document.querySelectorAll('.magnetic-el').forEach((el) => {
        ;(el as HTMLElement).style.transform = ''
      })
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])
}
