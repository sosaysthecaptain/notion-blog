export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-text">
        Copyright © {year} Marc Auger
      </div>
      {/* <div className="footer-links">
        <a href="/blog" className="footer-link">Projects</a>
        <span className="footer-separator">|</span>
        <a href="/gallery" className="footer-link">Optical Profilometer</a>
        <span className="footer-separator">|</span>
        <a href="/gitbot9000" className="footer-link">Space Trader</a>
        <span className="footer-separator">|</span>
        <a href="/fdm-startup" className="footer-link">FDM Startup</a>
        <span className="footer-separator">|</span>
        <a href="/about" className="footer-link">About</a>
      </div> */}
    </footer>
  )
}
