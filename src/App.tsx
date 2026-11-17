import { useEffect, useState } from 'react'
import { featured, moreWork, earlierWork, type Project } from './portfolio'
import './portfolio.css'

const base = 'https://www.sambhav.app'
function Card({ project }: { project: Project }) {
  return <article className="work-card"><p className="eyebrow">{project.status}</p><h3>{project.title}</h3><p>{project.summary}</p><p className="proof">{project.proof}</p><a href={`/work/${project.slug}`}>Read {project.title} →</a></article>
}
function App() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    const onPop = () => setPath(location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const project = featured.find(p => path === `/work/${p.slug}`)
  const isHome = path === '/'
  useEffect(() => {
    document.title = project ? `${project.title} | Sambhav Lamichhane` : `${path === '/work' ? 'Work | ' : path === '/about' ? 'About | ' : ''}Sambhav Lamichhane`
  }, [path, project])
  return <><a className="skip" href="#main">Skip to content</a><header><a className="brand" href="/">Sambhav Lamichhane</a><nav aria-label="Main navigation"><a href="/work">Work</a><a href="/about">About</a><a href="/#contact">Contact</a></nav></header><main id="main" tabIndex={-1}>
    {isHome ? <><section className="hero"><div><p className="eyebrow">Kathmandu → Minnesota</p><h1>Sambhav<br />Lamichhane</h1><p className="intro">I build products that make costs, tradeoffs, and messy data easier to understand.</p><p>M.S. in Data Science student and New Product Tech Ventures Fellow at the University of St. Thomas.</p><div className="actions"><a className="primary" href="#selected">View selected work</a><a href="#contact">Get in touch →</a></div></div><img src="/portrait.png" alt="Sambhav Lamichhane" width="450" height="450" /></section><section id="selected"><div className="section-heading"><div><p className="eyebrow">Research · Product · Data</p><h2>Selected work</h2></div><a href="/work">See all work →</a></div><div className="cards">{featured.map(p => <Card key={p.slug} project={p} />)}</div></section><section className="about-short"><p className="eyebrow">About</p><h2>From Kathmandu to Minnesota.</h2><p>I grew up around my family’s motorcycle dealership in Kathmandu, where I learned how business decisions affect people. At St. Thomas, I bring that curiosity to research and building tools for real workflows.</p><a href="/about">More about me →</a></section></> : project ? <article className="case"><a href="/work">← All work</a><p className="eyebrow">{project.status}</p><h1>{project.title}</h1><p className="intro">{project.summary}</p><p className="proof">{project.role}</p><p>{project.proof}</p>{project.sections.map(s => <section key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></section>)}</article> : path === '/work' ? <section><p className="eyebrow">Selected projects and research</p><h1>Work</h1><div className="cards">{featured.map(p => <Card key={p.slug} project={p} />)}</div>{[[ 'More work', moreWork ], ['Earlier work', earlierWork ]].map(([heading, entries]) => <section key={heading as string}><h2>{heading as string}</h2><div className="archive">{(entries as typeof moreWork).map(p => <article key={p.title}><h3>{p.title}</h3><p>{p.summary}</p>{p.url && <a href={p.url}>{p.title.includes('EV') ? 'View research poster' : 'Visit project'} →</a>}</article>)}</div></section>)}</section> : path === '/about' ? <section className="case"><p className="eyebrow">About</p><h1>Curious about how things work.</h1><p className="intro">I grew up in Kathmandu and came to Minnesota for college. My family’s motorcycle dealership was an early lesson in how decisions and relationships shape a business.</p><h2>Now</h2><p>I’m an M.S. in Data Science student and New Product Tech Ventures Fellow at the University of St. Thomas, with graduation expected in December 2027.</p><h2>Along the way</h2><p>In 2026 I researched remittances with Nepal’s Ministry of Foreign Affairs and built an internal point of sale system at Refresh Recreation Center. Earlier, I worked at LEAF Lab and STELAR and cofounded the Ruta’al prototype.</p><p>During my first month at St. Thomas, I campaigned for class president with a homemade poster on a yardstick.</p><p>I recently started a project called Foremargin to explore how to estimate AI task costs before a run.</p></section> : <section className="case"><h1>Page not found</h1><p>That page is unavailable.</p><a href="/work">Explore the work →</a></section>}
    <section id="contact" className="contact"><p className="eyebrow">Get in touch</p><h2>Let’s talk.</h2><p>I’m happy to talk about product, applied AI, fintech, and data projects. You can reach me by email or on LinkedIn.</p><div className="actions"><a href="mailto:lami9190@stthomas.edu">Email ↗</a><a href="https://linkedin.com/in/sambhavlamichhane">LinkedIn ↗</a><a href="https://github.com/Sambhav255">GitHub ↗</a></div></section>
  </main><footer>© {new Date().getFullYear()} Sambhav Lamichhane <a href={base}>sambhav.app</a></footer></>
}
export default App
