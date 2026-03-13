import { useState } from 'react'
import { HeroSection } from './HeroSection'
import experience from '../experience.json'
import { ProjectModal, type ProjectDetails } from './ProjectModal'
import { TabId } from './Navbar'

interface HomeViewProps {
  onNavigate: (tab: TabId) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const stats = experience.about?.stats ?? []
  const projects = experience.projects ?? []
  const [activeProject, setActiveProject] = useState<ProjectDetails | null>(null)
  const featuredProjects = projects.filter((p: { featured?: boolean }) => p.featured)

  return (
    <div className="home-section">
      <HeroSection data={experience.hero} onViewProjects={() => onNavigate('projects')} />
      <hr className="home-hero-divider" />

      {/* Journey teaser: slim horizontal banner */}
      <section className="home-journey-teaser">
        <button
          type="button"
          className="home-journey-teaser-banner magnetic-el"
          onClick={() => onNavigate('journey')}
        >
          <div className="home-journey-teaser-content">
            <span className="home-journey-teaser-label">MY STORY</span>
            <p className="home-journey-teaser-quote">&quot;From Kathmandu to Minnesota, and everything built along the way.&quot;</p>
          </div>
          <span className="home-journey-teaser-link">Read my journey &rarr;</span>
        </button>
      </section>

      {stats.length >= 4 && (
        <section className="home-stats-section">
          <div className="section-label">By the numbers</div>
          <div className="home-stats-row">
            {[
              'International student Class President at UST',
              "Won with Ruta'al across competitions",
              'Backtests as Quant Researcher',
              'Students served through VR Lab',
            ].map((label, i) => (
              <div key={label} className="home-stat">
                <div className="home-stat-value">{stats[i]?.value}</div>
                <div className="home-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <div className="home-projects">
          <div className="home-projects-header">
            <h3 className="home-selected-title">Selected Work</h3>
            <button type="button" className="home-selected-link" onClick={() => onNavigate('projects')}>
              View all {projects.length} projects &rarr;
            </button>
          </div>
          <div className="projects-grid">
            {featuredProjects.map((p) => {
              const isFlagship = !!(p as Record<string, unknown>).flagship
              const projectContext = (p as Record<string, unknown>).projectContext as string | undefined
              const demoUrl = p.demoUrl
              return (
                <div
                  key={p.name}
                  className={`project-card magnetic-el ${isFlagship ? 'project-card-flagship' : ''}`}
                >
                  <button
                    type="button"
                    className="project-card-link project-card-button"
                    onClick={() =>
                      setActiveProject({
                        name: p.name,
                        oneLiner: p.oneLiner,
                        description: p.description,
                        tags: p.tags ?? [],
                        demoUrl: p.demoUrl,
                        repoUrl: p.repoUrl,
                        pitchDeckUrl: (p as Record<string, unknown>).pitchDeckUrl as string | undefined,
                        results: (p as Record<string, unknown>).results as string[] | undefined,
                        why: (p as Record<string, unknown>).why as string | undefined,
                        doDifferently: (p as Record<string, unknown>).doDifferently as string | undefined,
                      })
                    }
                  >
                    <h3>{p.name}</h3>
                    <p className="one-liner">{p.oneLiner}</p>
                    {projectContext && <p className="project-context">{projectContext}</p>}
                    <p className="description">{p.description}</p>
                    {demoUrl && demoUrl !== '#' && (
                      <span className="project-card-live">Live · Click for demo & full story</span>
                    )}
                    {(!demoUrl || demoUrl === '#') && (
                      <span className="project-teaser">Click for full story</span>
                    )}
                  </button>
                  <div className="tags">
                    {(p.tags ?? []).map((tag: string) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}


      {/* Block 4: About + Ruta'al */}
      <section className="home-about-section">
        <div className="home-about-grid">
          <div className="home-about-left">
            <div className="section-label">Who I Am</div>
            <h3 className="home-about-heading">Builder, researcher, founder-in-progress</h3>
            <p className="home-about-body">
              I grew up in Kathmandu with the Himalayas as my backdrop and a family motorcycle dealership as my first business classroom. That ground-level education in how money actually moves shaped everything I&apos;ve built since. I came to the US for college, won First-Year Class President in my first month knowing no one, and have spent the last three years at the intersection of markets and technology.
            </p>
            <p className="home-about-body">
              I&apos;m a PM Fellow at LEAF Lab, a VR lab manager at STELAR, and a fintech co-founder, simultaneously. I use AI tools daily as a force multiplier: Claude, ChatGPT, Gemini, Cursor. I&apos;m genuinely obsessed with where these tools are going and want to be building inside that.
            </p>
            <p className="home-about-body">
              Outside of work: solo travel across seven countries, Formula 1 and Premier League with too much statistical analysis, and co-founding UST&apos;s Culinary Club: because food is how I stayed connected to home while building a life somewhere completely new.
            </p>
            <button type="button" className="home-about-link" onClick={() => onNavigate('journey')}>
              Read my full journey &rarr;
            </button>
          </div>
          <div className="home-about-right">
            <div className="section-label">Current Obsession</div>
            <h3 className="home-about-heading">Why I&apos;m building Ruta&apos;al</h3>
            <p className="home-about-body">
              250 million informal workers in Mexico and Nepal operate entirely outside the formal financial system: no credit score, no bank account, no safety net. Ruta&apos;al is a USSD-based fintech platform that works without smartphones or internet. I&apos;ve led product strategy, built the functional prototype, conducted TAM/SAM/SOM analysis, and pitched to investors and judges across three competitions.
            </p>
            <div className="home-about-stat">
              <div className="home-about-stat-value">$6,000</div>
              <div className="home-about-stat-label">Won across three business competitions</div>
            </div>
            <div className="home-about-stat">
              <div className="home-about-stat-value">2</div>
              <div className="home-about-stat-label">Emerging markets: Mexico and Nepal</div>
            </div>
            <div className="home-about-stat">
              <div className="home-about-stat-value">0</div>
              <div className="home-about-stat-label">Smartphones required: USSD works on any phone</div>
            </div>
          </div>
        </div>
      </section>

      {/* Block 5: Highlights (two cards) */}
      <section className="home-highlights-section">
        <div className="section-label">A Few Highlights</div>
        <h3 className="home-highlights-heading">Things I&apos;m proud of</h3>
        <div className="home-highlights-grid">
          <div className="home-highlight-card">
            <div className="home-highlight-label">UST Undergraduate Student Government</div>
            <div className="home-highlight-title">First international student elected Class President</div>
            <p className="home-highlight-body">
              Won in my first month in the US knowing no one, campaigning with a homemade poster on a yardstick. Managed a $115,000 budget across 150+ student organizations as the first international student to hold the role.
            </p>
          </div>
          <div className="home-highlight-card">
            <div className="home-highlight-label">STELAR VR Lab · UST</div>
            <div className="home-highlight-title">Managing 100+ devices for 500+ students</div>
            <p className="home-highlight-body">
              Run the VR lab fleet at St. Thomas, onboarding faculty, troubleshooting hardware, and expanding use cases across nursing and business programs. Built the written guides and FAQs that made the lab self-sufficient.
            </p>
          </div>
        </div>
      </section>

      {/* Closing transition before footer */}
      <section className="home-closing-cta">
        <button type="button" className="home-closing-link" onClick={() => onNavigate('projects')}>
          Want to see the work? &rarr;
        </button>
        <span className="home-closing-sep" aria-hidden="true"> </span>
        <button type="button" className="home-closing-link" onClick={() => onNavigate('contact')}>
          Let&apos;s talk &rarr;
        </button>
      </section>
    </div>
  )
}
