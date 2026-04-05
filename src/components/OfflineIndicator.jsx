import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showRestored, setShowRestored] = useState(false)

  useEffect(() => {
    const handleOffline = () => setIsOnline(false)
    const handleOnline = () => {
      setIsOnline(true)
      setShowRestored(true)
      setTimeout(() => setShowRestored(false), 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (isOnline && !showRestored) return null

  return (
    <AnimatePresence>
      <motion.div
        key="offline-bar"
        className={`offline-bar ${isOnline ? 'online' : 'offline'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="offline-dot" />
        <span className="offline-text">
          {isOnline ? 'Connection restored' : 'You\'re offline — PRISM needs a connection to run'}
        </span>

        <style>{`
          .offline-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-2);
            padding: var(--space-2) var(--space-4);
            font-family: var(--font-mono);
            font-size: 0.63rem;
            letter-spacing: 0.08em;
            overflow: hidden;
          }

          .offline-bar.offline {
            background: rgba(201, 126, 126, 0.15);
            border-bottom: 1px solid rgba(201, 126, 126, 0.3);
            color: #c97e7e;
          }

          .offline-bar.online {
            background: rgba(155, 196, 155, 0.12);
            border-bottom: 1px solid rgba(155, 196, 155, 0.3);
            color: #9bc49b;
          }

          .offline-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            flex-shrink: 0;
            background: currentColor;
          }

          .offline-text {
            text-align: center;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  )
}
