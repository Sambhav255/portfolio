import { useEffect } from 'react'
import { HeroSection } from './HeroSection'
import experience from '../experience.json'

export function HomeView() {
  const stats = experience.about?.stats ?? []
  const aboutSection = experience.sections?.find((s: { id: string }) => s.id === 'about')
  const storyBody = aboutSection?.body

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3952a87a-600c-469a-8b44-53ba21afdd5b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'initial',
        hypothesisId: 'H2',
        location: 'src/components/HomeView.tsx:8',
        message: 'HomeView rendered',
        data: { statsCount: stats.length, hasStory: Boolean(storyBody) },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion agent log
  }, [])

  return (
    <div className="home-section">
      <HeroSection data={experience.hero} />
      {stats.length > 0 && (
        <div className="home-stats-wrap">
          {stats.map((s, i) => (
            <div key={i} className="about-stat">
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {storyBody && (
        <div className="home-story glass">
          <h3 className="home-story-title">My Story</h3>
          <p className="section-body">{storyBody}</p>
        </div>
      )}
    </div>
  )
}
