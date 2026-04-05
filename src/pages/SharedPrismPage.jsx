import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import StageRefract from '../components/StageRefract'
import StageDistill from '../components/StageDistill'
import StageCrystallize from '../components/StageCrystallize'

export default function SharedPrismPage() {
  const { token } = useParams()
  const [prism, setPrism] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchShared() {
      const { data, error } = await supabase
        .from('prisms')
        .select('*')
        .eq('share_token', token)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setPrism(data)
      }
      setLoading(false)
    }
    fetchShared()
  }, [token])

  if (loading) {
    return (
      <div className="shared-loading">
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="shared-loading-wordmark"
        >
          PRISM
        </motion.div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="shared-notfound">
        <span className="nf-icon">◈</span>
        <h1 className="nf-title">This PRISM doesn't exist</h1>
        <p className="nf-sub">It may have been removed or the link is incorrect.</p>
        <Link to="/" className="nf-cta">Run your own →</Link>
      </div>
    )
  }

  return (
    <motion.div
      className="shared-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="shared-header">
        <span className="shared-wordmark">PRISM</span>
        <span className="shared-badge">Shared output</span>
      </div>

      {/* Content */}
      <div className="shared-content">
        <StageRefract input={prism.input} perspectives={prism.perspectives} />
        <StageDistill signal={prism.signal} />
        <StageCrystallize brief={prism.brief} />
      </div>

      {/* Footer CTA */}
      <motion.div
        className="shared-footer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="footer-divider" />
        <div className="footer-content">
          <p className="footer-text">
            This output was generated with PRISM — a generative thinking tool.
          </p>
          <Link to="/" className="footer-cta">Run your own →</Link>
        </div>
      </motion.div>

      <style>{`
        .shared-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shared-loading-wordmark {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: 0.4em;
          color: var(--c-text-muted);
        }

        .shared-notfound {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
          padding: var(--space-8);
          text-align: center;
        }

        .nf-icon {
          font-size: 2.5rem;
          color: var(--c-text-dim);
        }

        .nf-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--c-text);
        }

        .nf-sub {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--c-text-muted);
          letter-spacing: 0.05em;
          line-height: 1.6;
        }

        .nf-cta {
          margin-top: var(--space-3);
          color: var(--c-accent);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          border: 1px solid var(--c-accent);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius);
          transition: background 0.2s;
        }

        .nf-cta:hover { background: var(--c-accent-dim); }

        .shared-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .shared-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--c-border);
          position: sticky;
          top: 0;
          background: rgba(10,10,8,0.9);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .shared-wordmark {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: var(--c-text-muted);
        }

        .shared-badge {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--c-text-dim);
          border: 1px solid var(--c-border);
          padding: 2px var(--space-3);
          border-radius: 20px;
        }

        .shared-content {
          max-width: var(--max-w);
          margin: 0 auto;
          width: 100%;
          padding: var(--space-8) var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-7);
          flex: 1;
        }

        .shared-footer {
          max-width: var(--max-w);
          margin: 0 auto;
          width: 100%;
          padding: 0 var(--space-5) var(--space-10);
        }

        .footer-divider {
          height: 1px;
          background: var(--c-border);
          margin-bottom: var(--space-6);
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-5);
          flex-wrap: wrap;
        }

        .footer-text {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--c-text-dim);
          letter-spacing: 0.05em;
          line-height: 1.6;
          max-width: 340px;
        }

        .footer-cta {
          color: var(--c-accent);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          border: 1px solid var(--c-accent);
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius);
          white-space: nowrap;
          transition: background 0.2s;
          min-height: 44px;
          display: flex;
          align-items: center;
        }

        .footer-cta:hover { background: var(--c-accent-dim); }
      `}</style>
    </motion.div>
  )
}
