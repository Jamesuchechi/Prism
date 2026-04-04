import { motion } from 'framer-motion'

export default function StageCrystallize({ brief, isLoading }) {
  return (
    <motion.div
      className="stage stage-crystallize"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stage-header">
        <span className="stage-label" style={{ color: 'var(--c-crystallize)' }}>◈ Crystallize</span>
        <span className="stage-sublabel">Your creative brief</span>
      </div>

      {isLoading && !brief && (
        <motion.div
          className="crystallize-loading"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="loading-bar" />
          <div className="loading-bar short" />
          <div className="loading-bar medium" />
        </motion.div>
      )}

      {brief && (
        <motion.div
          className="brief-grid"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Concept */}
          <motion.div
            className="brief-row"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
          >
            <span className="brief-key">Concept</span>
            <p className="brief-value concept-value">{brief.concept}</p>
          </motion.div>

          {/* Tone */}
          <motion.div
            className="brief-row"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span className="brief-key">Tone</span>
            <div className="tone-words">
              {brief.tone?.map((word, i) => (
                <span key={i} className="tone-word">{word}</span>
              ))}
            </div>
          </motion.div>

          {/* Palette */}
          <motion.div
            className="brief-row brief-row-palette"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <span className="brief-key">Palette</span>
            <div className="palette">
              {brief.palette?.map((swatch, i) => (
                <div key={i} className="swatch-item">
                  <div
                    className="swatch"
                    style={{ background: swatch.hex }}
                    title={swatch.rationale}
                  />
                  <div className="swatch-info">
                    <span className="swatch-name">{swatch.name}</span>
                    <span className="swatch-hex">{swatch.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Directions */}
          <motion.div
            className="brief-row"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <span className="brief-key">Directions</span>
            <div className="directions">
              {brief.directions?.map((dir, i) => (
                <div key={i} className="direction-item">
                  <span className="direction-bullet">—</span>
                  <span className="direction-text">{dir}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .stage-crystallize {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
        }

        .stage-crystallize .stage-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .crystallize-loading {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .loading-bar {
          height: 1px;
          background: var(--c-border-light);
          width: 100%;
        }

        .loading-bar.short { width: 60%; }
        .loading-bar.medium { width: 80%; }

        .brief-grid {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--c-border);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .brief-row {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: var(--space-4);
          padding: var(--space-5);
          border-bottom: 1px solid var(--c-border);
          align-items: start;
        }

        .brief-row:last-child {
          border-bottom: none;
        }

        .brief-key {
          font-family: var(--font-mono);
          font-size: 0.63rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--c-text-muted);
          padding-top: 3px;
        }

        .brief-value {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.6;
          color: var(--c-text);
        }

        .concept-value {
          font-size: 1.1rem;
          font-style: italic;
        }

        .tone-words {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          padding-top: 2px;
        }

        .tone-word {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--c-crystallize);
          border: 1px solid var(--c-crystallize);
          padding: 2px var(--space-3);
          border-radius: 20px;
          letter-spacing: 0.1em;
        }

        .palette {
          display: flex;
          gap: var(--space-5);
          flex-wrap: wrap;
        }

        .swatch-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .swatch {
          width: 40px;
          height: 40px;
          border-radius: var(--radius);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .swatch:hover {
          transform: scale(1.1);
        }

        .swatch-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .swatch-name {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--c-text-muted);
          letter-spacing: 0.08em;
        }

        .swatch-hex {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--c-text-dim);
        }

        .directions {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding-top: 2px;
        }

        .direction-item {
          display: flex;
          gap: var(--space-3);
          align-items: baseline;
        }

        .direction-bullet {
          color: var(--c-crystallize);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        .direction-text {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.5;
          color: var(--c-text);
        }
      `}</style>
    </motion.div>
  )
}