import { motion } from 'framer-motion'

export default function LandingPage({ onSignIn }) {
  return (
    <div className="landing-page">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="prism-logo">◈</div>
          <h1 className="hero-title">PRISM</h1>
          <p className="hero-tagline">Break ideas into light.</p>
          
          <div className="hero-description">
            <p>
              A generative thinking tool for the nuanced mind. 
              Put something messy in. PRISM refracts it through multiple lenses, 
              distills the signal, and crystallizes the direction.
            </p>
          </div>

          <div className="hero-actions">
            <button className="cta-primary" onClick={onSignIn}>
              Get Started — Free
            </button>
            <p className="cta-sub">Sign in to save and share your findings.</p>
          </div>
        </motion.div>

        <motion.div 
          className="hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4, duration: 2 }}
        >
          <div className="glow-orb" />
        </motion.div>
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="feature-item">
            <span className="feat-label">01</span>
            <h3 className="feat-title">Refract</h3>
            <p className="feat-text">See your idea through 5 distinct psychological and philosophical lenses.</p>
          </div>
          <div className="feature-item">
            <span className="feat-label">02</span>
            <h3 className="feat-title">Distill</h3>
            <p className="feat-text">Identify the core signal and recurring patterns across perspectives.</p>
          </div>
          <div className="feature-item">
            <span className="feat-label">03</span>
            <h3 className="feat-title">Crystallize</h3>
            <p className="feat-text">Receive a concrete brief including concepts, tones, and palettes.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} PRISM • Generative Thinking Engine</p>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: #0a0a08;
          color: #fff;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-8) var(--space-5);
          text-align: center;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .prism-logo {
          font-size: 3rem;
          color: var(--c-accent);
          margin-bottom: var(--space-4);
          text-shadow: 0 0 20px rgba(200, 169, 110, 0.3);
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 15vw, 6rem);
          font-weight: 300;
          letter-spacing: 0.3em;
          line-height: 1;
          margin-bottom: var(--space-2);
        }

        .hero-tagline {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--c-text-muted);
          margin-bottom: var(--space-8);
        }

        .hero-description {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 300;
          line-height: 1.6;
          color: var(--c-text-muted);
          margin-bottom: var(--space-10);
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }

        .cta-primary {
          background: var(--c-accent);
          border: none;
          color: #000;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: var(--space-4) var(--space-8);
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .cta-sub {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--c-text-dim);
          letter-spacing: 0.05em;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .glow-orb {
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(200, 169, 110, 0.15) 0%, rgba(10, 10, 8, 0) 70%);
          border-radius: 50%;
          filter: blur(60px);
        }

        .features {
          padding: var(--space-10) var(--space-6);
          border-top: 1px solid var(--c-border);
          max-width: var(--max-w);
          margin: 0 auto;
          width: 100%;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-10);
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .feat-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--c-accent);
          opacity: 0.6;
        }

        .feat-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 300;
          letter-spacing: 0.1em;
        }

        .feat-text {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          line-height: 1.6;
          color: var(--c-text-muted);
        }

        .landing-footer {
          padding: var(--space-10) var(--space-6);
          text-align: center;
          border-top: 1px solid var(--c-border);
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--c-text-dim);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}
