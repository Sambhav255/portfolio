import experience from '../experience.json'

interface JourneyMilestone {
  date: string
  title: string
  impact: string
  lesson: string
  isImportant?: boolean
}

const MILESTONES = (experience as { journey?: JourneyMilestone[] }).journey ?? []

export function JourneyResume() {
  if (MILESTONES.length === 0) return null

  return (
    <section className="journey-section" data-section="journey">
      <div className="journey-header">
        <h2 className="journey-title">My Journey</h2>
        <p className="journey-subtitle">
          From Kathmandu to Minnesota, and everything built along the way.
        </p>
      </div>
      <div className="journey-inner">
        {MILESTONES.map((m, index) => {
          const isLeft = index % 2 === 0
          const isImportant = m.isImportant === true
          const isLast = index === MILESTONES.length - 1

          const card = (
            <div className={`journey-card glass ${isImportant ? 'journey-card-important' : ''} ${isLast ? 'journey-card-current' : ''}`}>
              <div className="journey-card-date">{m.date}</div>
              <div className="journey-card-title-row">
                <h3 className="journey-card-title">{m.title}</h3>
                {m.title.includes("Ruta'al") && (
                  <img src="/rutaal-logo.png" alt="Ruta'al logo" className="journey-logo" />
                )}
              </div>
              <p className="journey-card-impact">{m.impact}</p>
            </div>
          )

          return (
            <div className="journey-row" key={m.title}>
              <div className="journey-card-col journey-card-col-left">
                {isLeft ? card : null}
              </div>
              <div className="journey-card-col journey-card-col-right">
                {!isLeft ? card : null}
              </div>
              <div className="journey-node-dot" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
