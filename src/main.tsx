import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; info: { componentStack?: string } | null }
> {
  state = { error: null as Error | null, info: null as { componentStack?: string } | null }

  static getDerivedStateFromError(error: Error) {
    return { error, info: null }
  }

  componentDidCatch(_error: Error, info: { componentStack?: string }) {
    this.setState({ info })
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif', color: '#1A1A2E' }}>
          <h2 style={{ letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Render Error</h2>
          <div style={{ whiteSpace: 'pre-wrap', opacity: 0.85 }}>{this.state.error.message}</div>
          <div style={{ height: 16 }} />
          <div style={{ fontSize: 12, opacity: 0.7, whiteSpace: 'pre-wrap' }}>
            {this.state.error.stack || ''}
            {'\n'}
            {this.state.info?.componentStack || ''}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
