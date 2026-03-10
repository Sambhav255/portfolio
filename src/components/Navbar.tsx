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

  useEffect(() => {
    TABS.forEach(({ id }) => {
      const el = linkRefs.current.get(id)
      if (!el) return
      const isActive = activeTab === id
      gsap.to(el, {
        opacity: isActive ? 1 : 0.6,
        fontWeight: isActive ? 600 : 400,
        duration: 0.25,
        ease: 'power2.out',
      })
    })
  }, [activeTab])

  return (
    <nav ref={navRef} className="navbar" role="navigation">
      <div className="navbar-inner">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            ref={(el) => el && linkRefs.current.set(id, el)}
            className={`navbar-link ${activeTab === id ? 'navbar-link-active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
