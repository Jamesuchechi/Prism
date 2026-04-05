import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrism } from './hooks/usePrism'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './context/AuthContext'
import InputScreen from './components/InputScreen'
import StageRefract from './components/StageRefract'
import StageDistill from './components/StageDistill'
import StageCrystallize from './components/StageCrystallize'
import OutputCard from './components/OutputCard'
import InstallBanner from './components/InstallBanner'
import OfflineIndicator from './components/OfflineIndicator'
import UpdateToast from './components/UpdateToast'
import AuthSheet from './components/AuthSheet'
import LibraryScreen from './components/LibraryScreen'
import LandingPage from './pages/LandingPage'
import SharedPrismPage from './pages/SharedPrismPage'
import AuthCallback from './pages/AuthCallback'

export default function App() {
  const { user, isLoading: authLoading } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const [authSheetOpen, setAuthSheetOpen] = useState(false)
  const [authReason, setAuthReason] = useState('')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const prismA = usePrism()
  const prismB = usePrism()
  const [isDual, setIsDual] = useState(false)

  const isProcessing = [prismA, prismB].some(p => 
    ['refracting', 'distilling', 'crystallizing'].includes(p.status)
  )

  const isIdle = prismA.status === 'idle' && (isDual ? prismB.status === 'idle' : true)

  const handleReset = () => {
    prismA.reset()
    prismB.reset()
  }

  const handleRemix = (signal) => {
    prismA.reset()
    prismB.reset()
    setIsDual(false)
    prismA.setInput(signal)
  }

  const triggerAuth = (reason) => {
    setAuthReason(reason)
    setAuthSheetOpen(true)
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
          onAuthRequired={triggerAuth}
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

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="loading-prism"
        >
            PRISM
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`app theme-${theme}`}>
      <OfflineIndicator />
      <UpdateToast />

      <Routes>
        <Route path="/" element={
          !user ? (
            <LandingPage onSignIn={() => triggerAuth('Sign in to start refracting your ideas.')} />
          ) : (
            <>
              <div className="top-bar">
                <div className="top-bar-left">
                  <span className="wordmark-sm">PRISM</span>
                  <button className="theme-toggle" onClick={toggleTheme}>
                    {isDark ? '○' : '●'}
                  </button>
                  <button className="library-toggle" onClick={() => setLibraryOpen(true)}>
                    Library ◈
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
                    onRun={(vA, vB, lenses) => {
                      prismA.run(vA, lenses)
                      if (isDual) prismB.run(vB, lenses)
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
            </>
          )
        } />
        
        <Route path="/p/:token" element={<SharedPrismPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>


      <AuthSheet 
        isOpen={authSheetOpen} 
        onClose={() => setAuthSheetOpen(false)} 
        reason={authReason}
      />

      <AnimatePresence>
        {libraryOpen && (
          <LibraryScreen onClose={() => setLibraryOpen(false)} />
        )}
      </AnimatePresence>

      <InstallBanner />

      <style>{`
        .auth-loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a08;
            color: var(--c-text-muted);
            font-family: var(--font-display);
            font-size: 1.5rem;
            letter-spacing: 0.3em;
        }

        .loading-prism {
            text-shadow: 0 0 20px rgba(200, 169, 110, 0.3);
        }

        .app {
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

        .theme-toggle, .library-toggle {
          background: transparent;
          border: none;
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          padding: var(--space-1) var(--space-2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .theme-toggle:hover, .library-toggle:hover {
          color: var(--c-accent);
          transform: translateY(-1px);
        }

        .library-toggle {
            border: 1px solid var(--c-border);
            border-radius: 20px;
            padding: 2px var(--space-3);
            margin-left: var(--space-2);
        }

        .wordmark-sm {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: var(--c-text-muted);
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
          background: var(--c-accent);
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
          color: var(--c-text-muted);
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

        .retry-btn {
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--c-accent);
          background: transparent;
          color: var(--c-accent);
        }

      `}</style>
    </div>
  )
}