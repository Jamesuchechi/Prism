import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function InstallBanner() {
  const { canInstall, isIOS, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  if (!canInstall || dismissed) return null

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true)
    } else {
      await promptInstall()
    }
  }

  return (
    <>
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            className="install-banner"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ delay: 3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="install-content">
              <div className="install-icon">◈</div>
              <div className="install-text">
                <span className="install-title">Add PRISM to home screen</span>
                <span className="install-sub">Use it like an app, anytime</span>
              </div>
            </div>
            <div className="install-actions">
              <button className="install-dismiss" onClick={() => setDismissed(true)}>
                Not now
              </button>
              <button className="install-cta" onClick={handleInstall}>
                Install
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS instructions sheet */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            className="ios-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div
              className="ios-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="ios-handle" />
              <h3 className="ios-title">Install PRISM</h3>
              <div className="ios-steps">
                <div className="ios-step">
                  <span className="ios-step-num">1</span>
                  <span className="ios-step-text">
                    Tap the <strong>Share</strong> button at the bottom of Safari
                  </span>
                </div>
                <div className="ios-step">
                  <span className="ios-step-num">2</span>
                  <span className="ios-step-text">
                    Scroll down and tap <strong>Add to Home Screen</strong>
                  </span>
                </div>
                <div className="ios-step">
                  <span className="ios-step-num">3</span>
                  <span className="ios-step-text">
                    Tap <strong>Add</strong> — PRISM appears on your home screen
                  </span>
                </div>
              </div>
              <button
                className="ios-close"
                onClick={() => { setShowIOSGuide(false); setDismissed(true) }}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .install-banner {
          position: fixed;
          bottom: env(safe-area-inset-bottom, 0);
          left: 0;
          right: 0;
          z-index: 1000;
          margin: var(--space-4);
          padding: var(--space-4) var(--space-5);
          background: var(--c-surface);
          border: 1px solid var(--c-border-light);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          backdrop-filter: blur(12px);
        }

        .install-content {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex: 1;
          min-width: 0;
        }

        .install-icon {
          font-size: 1.4rem;
          color: var(--c-accent);
          flex-shrink: 0;
          line-height: 1;
        }

        .install-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .install-title {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          color: var(--c-text);
          font-weight: 400;
        }

        .install-sub {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--c-text-muted);
          letter-spacing: 0.04em;
        }

        .install-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-shrink: 0;
        }

        .install-dismiss {
          background: transparent;
          border: none;
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          cursor: pointer;
          letter-spacing: 0.05em;
          padding: var(--space-2);
        }

        .install-cta {
          background: var(--c-accent);
          border: none;
          color: var(--c-bg);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: var(--space-2) var(--space-4);
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .install-cta:hover { opacity: 0.85; }

        /* iOS Sheet */
        .ios-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }

        .ios-sheet {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--c-surface);
          border-radius: 20px 20px 0 0;
          border: 1px solid var(--c-border-light);
          border-bottom: none;
          padding: var(--space-5) var(--space-6);
          padding-bottom: calc(var(--space-7) + env(safe-area-inset-bottom, 0px));
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .ios-handle {
          width: 36px;
          height: 4px;
          background: var(--c-border-light);
          border-radius: 2px;
          margin: 0 auto var(--space-2);
        }

        .ios-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 300;
          color: var(--c-text);
          text-align: center;
          letter-spacing: 0.1em;
        }

        .ios-steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .ios-step {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
        }

        .ios-step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid var(--c-accent);
          color: var(--c-accent);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ios-step-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--c-text-muted);
          line-height: 1.6;
          letter-spacing: 0.03em;
        }

        .ios-step-text strong {
          color: var(--c-text);
          font-weight: 400;
        }

        .ios-close {
          background: var(--c-accent);
          border: none;
          color: var(--c-bg);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: var(--space-4);
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          transition: opacity 0.2s;
        }

        .ios-close:hover { opacity: 0.85; }
      `}</style>
    </>
  )
}
