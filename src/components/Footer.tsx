export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-inner-simple">
        <span className="footer-copy">
          &copy; {new Date().getFullYear()} Sambhav Lamichhane
        </span>
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
