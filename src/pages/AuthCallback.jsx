import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Session is established, redirect home
      navigate('/', { replace: true })
    })
  }, [navigate])

  return (
    <div className="callback-screen">
      <motion.div
        className="callback-wordmark"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        PRISM
      </motion.div>
      <p className="callback-text">Signing you in…</p>

      <style>{`
        .callback-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
        }

        .callback-wordmark {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 0.4em;
          color: var(--c-text-muted);
        }

        .callback-text {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--c-text-dim);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}
