import { motion } from 'framer-motion'

export default function StageDistill({ signal, isLoading }) {
  return (
    <motion.div
      className="stage stage-distill"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stage-header">
        <span className="stage-label" style={{ color: 'var(--c-distill)' }}>◈ Distill</span>
        <span className="stage-sublabel">The signal beneath the noise</span>
      </div>

      <div className="signal-block">
        {isLoading && !signal && (
          <motion.div
            className="signal-loading"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </motion.div>
        )}

        {signal && (
          <motion.p
            className="signal-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {signal}
          </motion.p>
        )}
      </div>

      <style>{`
        .stage-distill {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
        }

        .stage-distill .stage-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .stage-sublabel {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--c-text-muted);
          letter-spacing: 0.12em;
        }

        .signal-block {
          border-left: 2px solid var(--c-distill);
          padding: var(--space-5) var(--space-6);
          background: var(--c-distill-dim);
          border-radius: 0 var(--radius) var(--radius) 0;
          min-height: 80px;
          display: flex;
          align-items: center;
        }

        .signal-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 300;
          line-height: 1.75;
          color: var(--c-text);
          font-style: italic;
        }

        .signal-loading {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }

        .loading-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--c-distill);
          display: inline-block;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </motion.div>
  )
}