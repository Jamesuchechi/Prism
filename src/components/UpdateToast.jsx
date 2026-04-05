import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateToast() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <AnimatePresence>
      <motion.div
        key="update-toast"
        className="update-toast"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="update-text">New version available</span>
        <button
          className="update-btn"
          onClick={() => updateServiceWorker(true)}
        >
          Update
        </button>
      </motion.div>

      <style>{`
        .update-toast {
          position: fixed;
          top: env(safe-area-inset-top, 0);
          left: 50%;
          transform: translateX(-50%);
          z-index: 2000;
          margin-top: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-3) var(--space-5);
          background: var(--c-surface);
          border: 1px solid var(--c-border-light);
          border-radius: 40px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
          white-space: nowrap;
        }

        .update-text {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--c-text-muted);
          letter-spacing: 0.08em;
        }

        .update-btn {
          background: var(--c-accent);
          border: none;
          color: var(--c-bg);
          font-family: var(--font-mono);
          font-size: 0.63rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: var(--space-1) var(--space-3);
          border-radius: 20px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .update-btn:hover { opacity: 0.85; }
      `}</style>
    </AnimatePresence>
  )
}
