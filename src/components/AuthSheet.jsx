import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AuthSheet({ isOpen, onClose, onSuccess }) {
  const { signInWithGoogle, signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('choose') // 'choose' | 'email'

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      // Page will redirect, no need to call onSuccess
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await signInWithMagicLink(email.trim())
      setEmailSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMode('choose')
    setEmail('')
    setEmailSent(false)
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="auth-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="auth-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <div className="auth-handle" />

            {!emailSent ? (
              <>
                <div className="auth-header">
                  <h2 className="auth-title">Sign in to PRISM</h2>
                  <p className="auth-sub">Save your PRISMs and access them anywhere.</p>
                </div>

                {mode === 'choose' && (
                  <div className="auth-options">
                    <button
                      className="google-btn"
                      onClick={handleGoogle}
                      disabled={loading}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="auth-divider">
                      <span>or</span>
                    </div>

                    <button
                      className="email-toggle-btn"
                      onClick={() => setMode('email')}
                    >
                      Continue with email
                    </button>
                  </div>
                )}

                {mode === 'email' && (
                  <form className="email-form" onSubmit={handleMagicLink}>
                    <button
                      type="button"
                      className="back-to-choose"
                      onClick={() => setMode('choose')}
                    >
                      ← Back
                    </button>
                    <input
                      type="email"
                      className="email-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      className="magic-btn"
                      disabled={loading || !email.trim()}
                    >
                      {loading ? 'Sending…' : 'Send magic link'}
                    </button>
                  </form>
                )}

                {error && <p className="auth-error">{error}</p>}
              </>
            ) : (
              <div className="email-sent">
                <div className="sent-icon">✦</div>
                <h3 className="sent-title">Check your email</h3>
                <p className="sent-body">
                  We sent a sign-in link to <strong>{email}</strong>.
                  Tap it to continue — no password needed.
                </p>
                <button className="sent-close" onClick={handleClose}>
                  Got it
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      <style>{`
        .auth-overlay {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
        }

        .auth-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 600;
          background: var(--c-surface);
          border: 1px solid var(--c-border-light);
          border-bottom: none;
          border-radius: 20px 20px 0 0;
          padding: var(--space-4) var(--space-6);
          padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom, 0px));
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .auth-handle {
          width: 36px;
          height: 4px;
          background: var(--c-border-light);
          border-radius: 2px;
          margin: 0 auto var(--space-2);
        }

        .auth-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .auth-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 300;
          color: var(--c-text);
          letter-spacing: 0.05em;
        }

        .auth-sub {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--c-text-muted);
          letter-spacing: 0.05em;
          line-height: 1.5;
        }

        .auth-options {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          width: 100%;
          padding: var(--space-4);
          background: #fff;
          border: none;
          border-radius: 8px;
          color: #1a1a1a;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: opacity 0.2s;
          min-height: 48px;
        }

        .google-btn:hover { opacity: 0.9; }
        .google-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--c-border);
        }

        .auth-divider span {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--c-text-dim);
          letter-spacing: 0.1em;
        }

        .email-toggle-btn {
          width: 100%;
          padding: var(--space-4);
          background: transparent;
          border: 1px solid var(--c-border-light);
          border-radius: 8px;
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 48px;
        }

        .email-toggle-btn:hover {
          border-color: var(--c-accent);
          color: var(--c-accent);
        }

        .email-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .back-to-choose {
          background: none;
          border: none;
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          text-align: left;
          padding: 0;
          min-height: unset;
        }

        .email-input {
          width: 100%;
          padding: var(--space-4);
          background: var(--c-bg);
          border: 1px solid var(--c-border-light);
          border-radius: 8px;
          color: var(--c-text);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          min-height: 48px;
        }

        .email-input:focus { border-color: var(--c-accent); }
        .email-input::placeholder { color: var(--c-text-dim); }

        .magic-btn {
          width: 100%;
          padding: var(--space-4);
          background: var(--c-accent);
          border: none;
          border-radius: 8px;
          color: var(--c-bg);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s;
          min-height: 48px;
        }

        .magic-btn:hover { opacity: 0.85; }
        .magic-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .auth-error {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #c97e7e;
          letter-spacing: 0.05em;
          text-align: center;
        }

        /* Email sent state */
        .email-sent {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          text-align: center;
          padding: var(--space-4) 0;
        }

        .sent-icon {
          font-size: 2rem;
          color: var(--c-accent);
          animation: spin-in 0.5s ease;
        }

        @keyframes spin-in {
          from { transform: rotate(-90deg) scale(0.5); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }

        .sent-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 300;
          color: var(--c-text);
          letter-spacing: 0.05em;
        }

        .sent-body {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--c-text-muted);
          line-height: 1.7;
          letter-spacing: 0.04em;
          max-width: 280px;
        }

        .sent-body strong {
          color: var(--c-text);
          font-weight: 400;
        }

        .sent-close {
          width: 100%;
          padding: var(--space-4);
          background: var(--c-accent);
          border: none;
          border-radius: 8px;
          color: var(--c-bg);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          min-height: 48px;
        }
      `}</style>
    </AnimatePresence>
  )
}
