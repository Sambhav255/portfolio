export type Project = { slug: string; title: string; status: string; summary: string; role: string; sections: { heading: string; body: string }[]; proof: string }

// Public-facing copy is limited to the approved handoff; do not add private interview material.
export const featured: Project[] = [
  { slug: 'nepal-remittance-research', title: 'Nepal remittance research', status: 'Research', summary: 'I investigated why informal remittance flows between Nepal and South Korea were hard to measure, then shifted the research when pricing evidence challenged my first hypothesis.', role: 'Research Fellow, Ministry of Foreign Affairs Nepal · June–August 2026', proof: '13 interviews across 7 institutions · Presented to Nepal’s Minister of Foreign Affairs and senior officials', sections: [
    { heading: 'The question', body: 'I began by investigating whether transfer fees explained the use of informal channels between South Korea and Nepal.' },
    { heading: 'What changed', body: 'Interviews and pricing data from seven licensed Korean operators challenged that starting point. The research shifted toward the difficulty of measuring informal flows and assessing the available evidence.' },
    { heading: 'Methods', body: 'I graded sources and worked with the fee data in Excel and R. The public account describes the research approach without sharing interview records or the underlying memo.' }
  ] },
  { slug: 'refresh-recreation', title: 'Refresh Recreation Center', status: 'Internal tool', summary: 'I built and deployed an internal point of sale system for a recreation center in Kathmandu, replacing manual ledgers with digital transaction records and daily revenue reporting.', role: 'Growth and operations · June–September 2026', proof: 'Built for reception staff and daily operations', sections: [
    { heading: 'The workflow', body: 'Reception staff had recorded sales in manual ledgers. The system supports entering a transaction, finding a membership and seeing the daily revenue total.' },
    { heading: 'What exists', body: 'I worked from staff requirements and deployed the internal tool. A ten-KPI operating dashboard was separate work.' }
  ] },
  { slug: 'rutaal', title: 'Ruta’al', status: 'Prototype', summary: 'I cofounded Ruta’al and built a functional USSD prototype to explore financial access for informal workers in Mexico and Nepal.', role: 'Cofounder · Product discovery and prototyping', proof: '$6,000 won across three business competitions', sections: [
    { heading: 'The idea', body: 'Ruta’al explored how a financial service could reach people with limited access to smartphones or the internet. USSD offered a familiar phone-based channel to explore.' },
    { heading: 'What I built', body: 'I worked on product discovery and built a functional prototype. Competition feedback and the prototype were early evidence, rather than proof of a deployed service.' }
  ] }
]

export const moreWork = [
  { title: 'Vigil', summary: 'Brings geopolitical signals together in a risk dashboard.', url: 'https://vigildashboard.vercel.app/' },
  { title: 'CardSense', summary: 'Analyzes spending across 15+ card products.', url: 'https://cardsense-psi.vercel.app/' },
  { title: 'Cortex AI Customer Intelligence System', summary: 'Used seven Snowflake Cortex AI functions and 22 automated dbt schema tests.' },
]
export const earlierWork = [
  { title: 'VibeTicker', summary: 'Explores market sentiment alongside price data.' },
  { title: 'Common Table', summary: 'A campus food resource finder.' },
  { title: 'Equity in EV Infrastructure', summary: 'Research on access to EV infrastructure.', url: '/datacom_poster.pdf' },
]
