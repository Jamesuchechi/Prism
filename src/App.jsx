import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrism } from './hooks/usePrism'
import { useShare } from './hooks/useShare'
import { useTheme } from './hooks/useTheme'
import InputScreen from './components/InputScreen'
import StageRefract from './components/StageRefract'
import StageDistill from './components/StageDistill'
import StageCrystallize from './components/StageCrystallize'
import OutputCard from './components/OutputCard'

const STAGE_LABELS = {
  refracting:    { text: 'Refracting...', color: 'var(--c-refract)' },
  distilling:    { text: 'Distilling...', color: 'var(--c-distill)' },
  crystallizing: { text: 'Crystallizing...', color: 'var(--c-crystallize)' },
}

export default function App() {
  const [isDual, setIsDual] = useState(false)
  const prismA = usePrism()
  const prismB = usePrism()
  
  const { decodeState } = useShare()
  const { theme, toggleTheme, isDark } = useTheme()

  const isProcessing = [prismA, prismB].some(p => 
    ['refracting', 'distilling', 'crystallizing'].includes(p.status)
  )

  const isIdle = prismA.status === 'idle' && (isDual ? prismB.status === 'idle' : true)

  // URL Hydration
  useEffect(() => {
    const sharedData = decodeState()
    if (sharedData) {
      prismA.hydrate(sharedData)
    }
  }, [])

  const handleReset = () => {
    prismA.reset()
    prismB.reset()
  }

  const handleRemix = (signal) => {
    prismA.reset()
    prismB.reset()
    setIsDual(false) // Remixing always goes back to single mode for refinement
    prismA.setInput(signal)
  }

  const renderResults = (prism, id) => (
    <div className={`results-content ${isDual ? 'dual-col' : ''}`} id={id}>
      {/* Stage 1 — Refract */}
      {(prism.perspectives || prism.status === 'refracting') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StageRefract
            input={prism.input}
            perspectives={prism.perspectives}
            isLoading={prism.status === 'refracting'}
          />
        </motion.div>
      )}

      {/* Stage 2 — Distill */}
      {(prism.signal || prism.status === 'distilling') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StageDistill
            signal={prism.signal}
            isLoading={prism.status === 'distilling'}
          />
        </motion.div>
      )}

      {/* Stage 3 — Crystallize */}
      {(prism.brief || prism.status === 'crystallizing') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StageCrystallize
            brief={prism.brief}
            isLoading={prism.status === 'crystallizing'}
          />
        </motion.div>
      )}

      {/* Output card actions */}
      {prism.status === 'complete' && (
        <OutputCard
          input={prism.input}
          perspectives={prism.perspectives}
          signal={prism.signal}
          brief={prism.brief}
          onReset={handleReset}
          onRemix={handleRemix}
        />
      )}

      {/* Error state */}
      {prism.status === 'error' && (
        <motion.div className="error-block">
          <span className="error-label">Error</span>
          <p className="error-message">{prism.error}</p>
          <button className="action-btn retry-btn" onClick={prism.retry}>Retry</button>
        </motion.div>
      )}
    </div>
  )

  return (
    <div className={`app theme-${theme}`}>
      {/* Global Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="wordmark-sm">PRISM</span>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDark ? '○' : '●'}
          </button>
        </div>

        {!isIdle && (
          <div className="top-bar-right">
            {isProcessing && (
              <motion.div className="processing-indicator">
                <span className="processing-dot" />
                <span className="processing-text">Crystallizing Thinking...</span>
              </motion.div>
            )}
            {!isProcessing && (
              <button className="back-btn" onClick={handleReset}>← New</button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isIdle ? (
          <InputScreen 
            key="input" 
            isDual={isDual}
            onToggleDual={() => setIsDual(!isDual)}
            onRun={(valA, valB, lenses) => {
              prismA.run(valA, lenses)
              if (isDual) prismB.run(valB, lenses)
            }} 
            history={prismA.history}
            onHydrate={prismA.hydrate}
            activeLenses={prismA.activeLenses}
            onSelectLenses={prismA.setActiveLenses}
            initialInputA={prismA.input}
          />
        ) : (
          <motion.div
            key="results"
            className={`results-layout ${isDual ? 'comparison-mode' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderResults(prismA, 'prism-results-left')}
            {isDual && renderResults(prismB, 'prism-results-right')}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .results-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .top-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          background: var(--c-glass-bg);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--c-border);
          transition: background 0.4s var(--ease-in-out), border-color 0.4s var(--ease-in-out);
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .theme-toggle {
          background: transparent;
          border: none;
          color: var(--c-text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          padding: var(--space-1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, transform 0.2s;
        }

        .theme-toggle:hover {
          color: var(--c-accent);
          transform: scale(1.1);
        }

        .wordmark-sm {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: var(--c-text-muted);
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .processing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: throb 1.2s ease-in-out infinite;
        }

        @keyframes throb {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .processing-text {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .back-btn {
          background: transparent;
          border: none;
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: color 0.2s;
          padding: var(--space-2) var(--space-3);
        }

        .back-btn:hover {
          color: var(--c-accent);
        }

        .results-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .results-layout.comparison-mode {
          flex-direction: row;
          gap: 0;
          align-items: flex-start;
          width: 100%;
        }

        @media (max-width: 1000px) {
          .results-layout.comparison-mode {
            flex-direction: column;
          }
        }

        .results-content {
          max-width: var(--max-w);
          margin: 0 auto;
          width: 100%;
          padding: var(--space-8) var(--space-5) var(--space-10);
          display: flex;
          flex-direction: column;
          gap: var(--space-7);
        }

        .results-content.dual-col {
          max-width: 600px;
          flex: 1;
          padding-top: var(--space-9);
        }

        .results-content.dual-col:first-child {
          border-right: 1px solid var(--c-border);
        }

        @media (max-width: 1000px) {
          .results-content.dual-col {
            max-width: var(--max-w);
            border-right: none !important;
            border-bottom: 1px solid var(--c-border);
          }
        }

        .error-block {
          max-width: var(--max-w);
          margin: 0 auto;
          width: 100%;
          padding: var(--space-6);
          border: 1px solid #c97e7e44;
          border-radius: var(--radius);
          background: rgba(201, 126, 126, 0.04);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .error-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c97e7e;
        }

        .error-message {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--c-text-muted);
          line-height: 1.5;
        }

        .error-actions {
          display: flex;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }

        .retry-btn, .reset-btn-err {
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-btn {
          background: transparent;
          border: 1px solid var(--c-accent);
          color: var(--c-accent);
        }

        .retry-btn:hover {
          background: var(--c-accent-dim);
        }

        .reset-btn-err {
          background: transparent;
          border: 1px solid var(--c-border-light);
          color: var(--c-text-muted);
        }

        .reset-btn-err:hover {
          border-color: var(--c-text-muted);
          color: var(--c-text);
        }
      `}</style>
    </div>
  )
}