export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-copy">
          &copy; {new Date().getFullYear()} Sambhav Lamichhane
        </span>
        <div className="footer-links">
          <a href="https://linkedin.com/in/sambhavlamichhane" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/Sambhav255" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="mailto:lami9190@stthomas.edu">
            Email
          </a>
        </div>
        <button
          className="footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          &uarr; Top
        </button>
      </div>
    </footer>
  )
}
