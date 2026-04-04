import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSoundEffects } from '../hooks/useSoundEffects'
import LensSelector from './LensSelector'

export default function InputScreen({ 
  onRun, 
  history = [], 
  onHydrate, 
  activeLenses, 
  onSelectLenses,
  isDual,
  onToggleDual,
  initialInputA = ''
}) {
  const [valueA, setValueA] = useState(initialInputA)
  const [valueB, setValueB] = useState('')
  const textareaRef = useRef(null)
  const { playClick, playTransition } = useSoundEffects()
  const MAX = 500

  useEffect(() => {
    setValueA(initialInputA)
  }, [initialInputA])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const vA = valueA.trim()
    const vB = valueB.trim()
    if (vA.length > 0 && (!isDual || vB.length > 0)) {
      playClick()
      playTransition()
      onRun(vA, isDual ? vB : '', activeLenses)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleHistoryClick = (item) => {
    playClick()
    playTransition()
    onHydrate(item)
  }

  const canSubmit = valueA.trim().length > 0 && (!isDual || valueB.trim().length > 0)

  return (
    <motion.div
      className="input-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="input-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-top">
          <span className="wordmark">PRISM</span>
          <button 
            className={`mode-toggle ${isDual ? 'active' : ''}`} 
            onClick={() => { playClick(); onToggleDual(); }}
          >
            {isDual ? 'Comparison Mode' : 'Single Mode'}
          </button>
        </div>
        <span className="tagline">Break ideas into light</span>
      </motion.div>

      <motion.div
        className={`input-body ${isDual ? 'dual-view' : ''}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="input-group">
          <label className="input-label" htmlFor="prism-input-a">
            {isDual ? 'Idea Alpha' : "What's on your mind?"}
          </label>
          <div className="textarea-wrap">
            <textarea
              id="prism-input-a"
              ref={textareaRef}
              className="prism-textarea"
              value={valueA}
              onChange={e => setValueA(e.target.value.slice(0, MAX))}
              onKeyDown={handleKeyDown}
              placeholder="First thought..."
              rows={isDual ? 4 : 5}
            />
          </div>
        </div>

        {isDual && (
          <div className="input-group">
            <label className="input-label" htmlFor="prism-input-b">Idea Beta</label>
            <div className="textarea-wrap">
              <textarea
                id="prism-input-b"
                className="prism-textarea"
                value={valueB}
                onChange={e => setValueB(e.target.value.slice(0, MAX))}
                onKeyDown={handleKeyDown}
                placeholder="Second thought..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Character Count & Shortcut (Simplified for Dual) */}
        {!isDual && (
           <div className="textarea-footer-solo">
            <span className="shortcut-hint">⌘ + ↵ to run</span>
          </div>
        )}

        {/* Lens Expansion */}
        <LensSelector 
          activeLenses={activeLenses}
          onSelect={onSelectLenses}
        />

        <button
          className="run-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <span>{isDual ? 'Refract Both' : 'Run PRISM'}</span>
          <span className="run-arrow">→</span>
        </button>
      </motion.div>

      {history.length > 0 && (
        <motion.div 
          className="recent-history"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <span className="history-label">Recent Recollections</span>
          <div className="history-list">
            {history.map((item, i) => (
              <button 
                key={i} 
                className="history-item"
                onClick={() => handleHistoryClick(item)}
              >
                <span className="history-dot" />
                <span className="history-text">{item.input}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="input-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <span className="stage-hint">Refract · Distill · Crystallize</span>
      </motion.div>

      <style>{`
        .input-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-8) var(--space-5);
          gap: var(--space-9);
        }

        @media (max-width: 600px) {
          .input-screen {
            padding: var(--space-6) var(--space-4);
            gap: var(--space-7);
          }
        }

        .input-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          width: 100%;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .mode-toggle {
          background: transparent;
          border: 1px solid var(--c-border);
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          padding: 2px var(--space-3);
          border-radius: 20px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }

        .mode-toggle:hover {
          border-color: var(--c-text-muted);
          color: var(--c-text);
        }

        .mode-toggle.active {
          border-color: var(--c-accent);
          color: var(--c-accent);
        }

        .wordmark {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 12vw, 5rem);
          font-weight: 300;
          letter-spacing: 0.3em;
          color: var(--c-text);
          line-height: 1;
        }

        .tagline {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: var(--c-text-muted);
          text-transform: uppercase;
        }

        .input-body {
          width: 100%;
          max-width: var(--max-w);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .input-body.dual-view {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
          max-width: 1000px;
        }

        @media (max-width: 800px) {
          .input-body.dual-view {
            grid-template-columns: 1fr;
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .textarea-footer-solo {
          display: flex;
          justify-content: flex-end;
          margin-top: calc(-1 * var(--space-2));
        }

        .input-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--c-text-muted);
          text-transform: uppercase;
        }

        .textarea-wrap {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--c-border);
          border-radius: var(--radius);
          background: var(--c-surface);
          transition: border-color 0.2s ease;
        }

        .textarea-wrap:focus-within {
          border-color: var(--c-border-light);
        }

        .prism-textarea {
          background: transparent;
          border: none;
          color: var(--c-text);
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 300;
          line-height: 1.7;
          padding: var(--space-5);
          resize: none;
          width: 100%;
          outline: none;
        }

        @media (max-width: 600px) {
          .prism-textarea {
            padding: var(--space-4);
            font-size: 1.1rem;
          }
        }

        .prism-textarea::placeholder {
          color: var(--c-text-dim);
          font-style: italic;
        }

        .textarea-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-4) var(--space-3);
          border-top: 1px solid var(--c-border);
        }

        .char-count {
          font-size: 0.65rem;
          color: var(--c-text-dim);
          font-family: var(--font-mono);
          min-height: 1em;
          transition: color 0.2s;
        }

        .char-count.warn {
          color: var(--c-accent);
        }

        .shortcut-hint {
          font-size: 0.65rem;
          color: var(--c-text-dim);
          font-family: var(--font-mono);
        }

        @media (max-width: 600px) {
          .shortcut-hint {
            display: none;
          }
        }

        .run-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--space-4) var(--space-5);
          background: transparent;
          border: 1px solid var(--c-accent);
          color: var(--c-accent);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: var(--radius);
          transition: background 0.2s ease, color 0.2s ease;
          min-height: 56px;
        }

        .run-btn:hover:not(:disabled) {
          background: var(--c-accent-dim);
        }

        .run-btn:disabled {
          border-color: var(--c-border);
          color: var(--c-text-dim);
          cursor: not-allowed;
        }

        .run-arrow {
          font-size: 1rem;
        }

        .input-footer {
          position: fixed;
          bottom: var(--space-6);
        }

        @media (max-height: 600px) {
          .input-footer {
            position: static;
            margin-top: var(--space-4);
          }
        }

        .stage-hint {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: var(--c-text-dim);
          text-transform: uppercase;
        }

        .recent-history {
          width: 100%;
          max-width: var(--max-w);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-top: var(--space-2);
        }

        .history-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--c-text-muted);
          opacity: 0.7;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .history-item {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) 0;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: transform 0.2s ease;
        }

        .history-item:hover {
          transform: translateX(4px);
        }

        .history-item:hover .history-text {
          color: var(--c-text);
        }

        .history-item:hover .history-dot {
          background: var(--c-accent);
          box-shadow: 0 0 8px var(--c-accent);
        }

        .history-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--c-border-light);
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .history-text {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.4;
          color: var(--c-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }
      `}</style>
    </motion.div>
  )
}