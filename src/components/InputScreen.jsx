import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function InputScreen({ onRun }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)
  const MAX = 500

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (value.trim().length > 0) onRun(value.trim())
    }
  }

  const handleSubmit = () => {
    if (value.trim().length > 0) onRun(value.trim())
  }

  const remaining = MAX - value.length
  const canSubmit = value.trim().length > 0

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
        <span className="wordmark">PRISM</span>
        <span className="tagline">Break ideas into light</span>
      </motion.div>

      <motion.div
        className="input-body"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <label className="input-label" htmlFor="prism-input">
          What's on your mind?
        </label>
        <div className="textarea-wrap">
          <textarea
            id="prism-input"
            ref={textareaRef}
            className="prism-textarea"
            value={value}
            onChange={e => setValue(e.target.value.slice(0, MAX))}
            onKeyDown={handleKeyDown}
            placeholder="A word. A feeling. A half-formed thought. A problem you can't name yet."
            rows={5}
            spellCheck={false}
          />
          <div className="textarea-footer">
            <span className={`char-count ${remaining < 50 ? 'warn' : ''}`}>
              {remaining < 100 ? `${remaining} left` : ''}
            </span>
            <span className="shortcut-hint">⌘ + ↵ to run</span>
          </div>
        </div>

        <button
          className="run-btn"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <span>Run PRISM</span>
          <span className="run-arrow">→</span>
        </button>
      </motion.div>

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

        .input-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }

        .wordmark {
          font-family: var(--font-display);
          font-size: clamp(3rem, 8vw, 5rem);
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
          gap: var(--space-4);
        }

        .input-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
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

        .prism-textarea::placeholder {
          color: var(--c-text-dim);
          font-style: italic;
        }

        .textarea-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-5) var(--space-3);
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

        .stage-hint {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: var(--c-text-dim);
          text-transform: uppercase;
        }
      `}</style>
    </motion.div>
  )
}