import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// #region agent log
;(function () {
  const endpoint = 'http://127.0.0.1:7245/ingest/3952a87a-600c-469a-8b44-53ba21afdd5b'
  const post = (hypothesisId: string, message: string, data: Record<string, unknown>) =>
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'initial',
        hypothesisId,
        location: 'src/main.tsx:startup',
        message,
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {})

  post('H_start', 'main.tsx loaded', { userAgent: navigator.userAgent })

  window.addEventListener('error', (e) => {
    post('H_err', 'window.error', {
      message: (e as ErrorEvent).message,
      filename: (e as ErrorEvent).filename,
      lineno: (e as ErrorEvent).lineno,
      colno: (e as ErrorEvent).colno,
    })
  })

  window.addEventListener('unhandledrejection', (e) => {
    post('H_err', 'unhandledrejection', {
      reason: String((e as PromiseRejectionEvent).reason),
    })
  })
})()
// #endregion agent log

// #region agent log
;(function () {
  const badge = document.createElement('div')
  badge.id = '__bootbadge'
  badge.textContent = 'BOOT: main.tsx executed'
  badge.style.position = 'fixed'
  badge.style.left = '12px'
  badge.style.bottom = '12px'
  badge.style.padding = '8px 10px'
  badge.style.borderRadius = '999px'
  badge.style.fontFamily = 'Inter, system-ui, sans-serif'
  badge.style.fontSize = '12px'
  badge.style.letterSpacing = '0.08em'
  badge.style.textTransform = 'uppercase'
  badge.style.background = 'rgba(255,255,255,0.85)'
  badge.style.backdropFilter = 'blur(10px)'
  badge.style.border = '1px solid rgba(26,26,46,0.08)'
  badge.style.color = '#1A1A2E'
  badge.style.zIndex = '2147483647'
  document.body.appendChild(badge)
})()
// #endregion agent log

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
