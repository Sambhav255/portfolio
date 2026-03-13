import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export type TabId = 'home' | 'projects' | 'journey' | 'contact'

interface NavbarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map())
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    TABS.forEach(({ id }) => {
      const el = linkRefs.current.get(id)
      if (!el) return
      const isActive = activeTab === id
      gsap.to(el, {
        fontWeight: isActive ? 600 : 400,
        duration: 0.25,
        ease: 'power2.out',
      })
    })

    const activeEl = linkRefs.current.get(activeTab)
    const indicator = indicatorRef.current
    if (activeEl && indicator) {
      const rect = activeEl.getBoundingClientRect()
      const navRect = navRef.current?.getBoundingClientRect()
      if (navRect) {
        gsap.to(indicator, {
          x: rect.left - navRect.left,
          width: rect.width,
          duration: 0.35,
          ease: 'power3.out',
        })
      }
    }
  }, [activeTab])

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (currentIndex + 1) % TABS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
    }
    if (nextIndex !== currentIndex) {
      onTabChange(TABS[nextIndex].id)
      linkRefs.current.get(TABS[nextIndex].id)?.focus()
    }
  }

  return (
    <nav ref={navRef} className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner" role="tablist">
        <div ref={indicatorRef} className="navbar-indicator" aria-hidden="true" />
        {TABS.map(({ id, label }, index) => (
          <button
            key={id}
            ref={(el) => el && linkRefs.current.set(id, el)}
            className={`navbar-link ${activeTab === id ? 'navbar-link-active' : ''}`}
            onClick={() => onTabChange(id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="tab"
            aria-selected={activeTab === id}
            tabIndex={activeTab === id ? 0 : -1}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
