import { motion } from 'framer-motion'

const LENS_COLORS = {
  'The Poet':     'var(--c-distill)',
  'The Scientist':'var(--c-refract)',
  'The Child':    '#9bc49b',
  'The Critic':   '#c9967e',
  'The Futurist': 'var(--c-accent)',
}

export default function StageRefract({ input, perspectives, isLoading }) {
  return (
    <div className="stage stage-refract">
      <motion.div
        className="stage-header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="stage-label" style={{ color: 'var(--c-refract)' }}>◈ Refract</span>
        <span className="stage-input-echo">"{input}"</span>
      </motion.div>

      <div className="perspectives">
        {isLoading && !perspectives && (
          <>
            {[0,1,2,3,4].map(i => (
              <motion.div
                key={i}
                className="perspective-card skeleton"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
                transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </>
        )}

        {perspectives && perspectives.map((p, i) => (
          <motion.div
            key={p.lens}
            className="perspective-card"
            initial={{ opacity: 0, x: -16, scale: 0.98 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              boxShadow: [
                '0 0 0px rgba(0,0,0,0)',
                `0 0 20px ${LENS_COLORS[p.lens]}11`,
                '0 0 0px rgba(0,0,0,0)'
              ]
            }}
            transition={{ 
              delay: i * 0.15, 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1],
              boxShadow: { delay: i * 0.15 + 0.2, duration: 1.5 }
            }}
          >
            <span
              className="lens-name"
              style={{ color: LENS_COLORS[p.lens] || 'var(--c-accent)' }}
            >
              {p.lens}
            </span>
            <p className="lens-text">{p.text}</p>
          </motion.div>
        ))}
      </div>

      <style>{`
        .stage {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
        }

        .stage-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        @media (max-width: 600px) {
          .stage-header {
            margin-bottom: var(--space-4);
          }
        }

        .stage-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 400;
        }

        .stage-input-echo {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-style: italic;
          color: var(--c-text-muted);
          font-weight: 300;
          line-height: 1.4;
        }

        @media (max-width: 600px) {
          .stage-input-echo {
            font-size: 1rem;
          }
        }

        .perspectives {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .perspective-card {
          padding: var(--space-5);
          border: 1px solid var(--c-border);
          border-radius: var(--radius);
          background: var(--c-surface);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        @media (max-width: 600px) {
          .perspective-card {
            padding: var(--space-4);
            gap: var(--space-2);
          }
        }

        .perspective-card.skeleton {
          height: 88px;
          background: var(--c-surface);
        }

        .lens-name {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 400;
        }

        .lens-text {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 300;
          line-height: 1.7;
          color: var(--c-text);
        }

        @media (max-width: 600px) {
          .lens-text {
            font-size: 1rem;
            line-height: 1.6;
          }
        }
      `}</style>
    </div>
  )
}