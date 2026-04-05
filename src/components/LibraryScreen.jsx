import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import LibraryCard from './LibraryCard'
import StageRefract from './StageRefract'
import StageDistill from './StageDistill'
import StageCrystallize from './StageCrystallize'

export default function LibraryScreen({ onClose }) {
  const { user, signOut } = useAuth()
  const [prisms, setPrisms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchPrisms()
  }, [])

  const fetchPrisms = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('prisms')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setPrisms(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('prisms').delete().eq('id', id)
    if (!error) setPrisms(prev => prev.filter(p => p.id !== id))
  }

  const handleRename = async (id, newTitle) => {
    const { error } = await supabase
      .from('prisms')
      .update({ title: newTitle })
      .eq('id', id)

    if (!error) {
      setPrisms(prev => prev.map(p => p.id === id ? { ...p, title: newTitle } : p))
    }
  }

  const handleSignOut = async () => {

    await signOut()
    onClose()
  }

  return (
    <motion.div
      className="library-screen"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
    >
      {/* Header */}
      <div className="library-header">
        <button className="library-back" onClick={onClose}>← Back</button>
        <span className="library-title">Your PRISMs</span>
        <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
      </div>

      {/* User pill */}
      <div className="user-pill">
        <span className="user-dot" />
        <span className="user-email">{user?.email}</span>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {selected ? (
          /* Detail view */
          <motion.div
            key="detail"
            className="library-detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="detail-back" onClick={() => setSelected(null)}>
              ← Library
            </button>
            <div className="detail-content">
              <StageRefract input={selected.input} perspectives={selected.perspectives} />
              <StageDistill signal={selected.signal} />
              <StageCrystallize brief={selected.brief} />
            </div>
          </motion.div>
        ) : (
          /* List view */
          <motion.div
            key="list"
            className="library-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loading && (
              <div className="library-loading">
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    className="card-skeleton"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            )}

            {!loading && prisms.length === 0 && (
              <div className="library-empty">
                <span className="empty-icon">◈</span>
                <p className="empty-text">No saved PRISMs yet.</p>
                <p className="empty-sub">Run PRISM and tap "Save" to build your library.</p>
                <button className="empty-cta" onClick={onClose}>Run PRISM →</button>
              </div>
            )}

            {!loading && prisms.length > 0 && (
              <div className="cards-list">
                {prisms.map((p, i) => (
                  <LibraryCard
                    key={p.id}
                    prism={p}
                    index={i}
                    onOpen={setSelected}
                    onDelete={handleDelete}
                    onRename={handleRename}
                  />

                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .library-screen {
          position: fixed;
          inset: 0;
          z-index: 400;
          background: var(--c-bg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .library-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--c-border);
          padding-top: calc(var(--space-4) + env(safe-area-inset-top, 0px));
        }

        .library-back, .signout-btn {
          background: none;
          border: none;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          min-height: 44px;
          padding: 0 var(--space-2);
          color: var(--c-text-muted);
          transition: color 0.2s;
        }

        .library-back:hover { color: var(--c-accent); }
        .signout-btn:hover { color: #c97e7e; }

        .library-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: var(--c-text);
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          border-bottom: 1px solid var(--c-border);
        }

        .user-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--c-accent);
          box-shadow: 0 0 6px var(--c-accent);
          flex-shrink: 0;
        }

        .user-email {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--c-text-muted);
          letter-spacing: 0.05em;
        }

        .library-list, .library-detail {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-5);
          padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom, 0px));
        }

        .library-loading {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .card-skeleton {
          height: 100px;
          border: 1px solid var(--c-border);
          border-radius: var(--radius);
          background: var(--c-surface);
        }

        .library-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-10) var(--space-5);
          text-align: center;
        }

        .empty-icon {
          font-size: 2rem;
          color: var(--c-text-dim);
        }

        .empty-text {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 300;
          color: var(--c-text-muted);
        }

        .empty-sub {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--c-text-dim);
          letter-spacing: 0.05em;
          line-height: 1.6;
        }

        .empty-cta {
          background: transparent;
          border: 1px solid var(--c-accent);
          color: var(--c-accent);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius);
          cursor: pointer;
          transition: background 0.2s;
          min-height: 44px;
        }

        .empty-cta:hover { background: var(--c-accent-dim); }

        .cards-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        /* Detail view */
        .detail-back {
          background: none;
          border: none;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--c-text-muted);
          letter-spacing: 0.08em;
          cursor: pointer;
          padding: 0;
          margin-bottom: var(--space-6);
          min-height: 44px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .detail-back:hover { color: var(--c-accent); }

        .detail-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-7);
        }
      `}</style>
    </motion.div>
  )
}
