import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LibraryCard({ prism, onOpen, onDelete, onRename, index }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(prism.title)

  const date = new Date(prism.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(prism.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const handleRename = (e) => {
    e.stopPropagation()
    if (isEditing && newTitle.trim() && newTitle !== prism.title) {
      onRename(prism.id, newTitle.trim())
    }
    setIsEditing(!isEditing)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRename(e)
    if (e.key === 'Escape') {
      setIsEditing(false)
      setNewTitle(prism.title)
    }
  }

  return (
    <motion.div
      className="library-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => !isEditing && onOpen(prism)}
    >
      <div className="card-content">
        <div className="card-top">
          {isEditing ? (
            <input
              className="card-title-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="card-title">{prism.title}</span>
          )}
          <span className="card-date">{date}</span>
        </div>
        <p className="card-signal">"{prism.signal}"</p>
        <div className="card-tags">
          {prism.brief?.tone?.map((t, i) => (
            <span key={i} className="card-tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="card-side-actions">
        <button
          className={`edit-btn ${isEditing ? 'active' : ''}`}
          onClick={handleRename}
          title={isEditing ? 'Save' : 'Rename'}
        >
          {isEditing ? '✓' : '✎'}
        </button>

        <button
          className={`delete-btn ${confirmDelete ? 'confirm' : ''}`}
          onClick={handleDelete}
          title={confirmDelete ? 'Tap again to delete' : 'Delete'}
        >
          {confirmDelete ? '✓ confirm' : '×'}
        </button>
      </div>

      <style>{`
        .library-card {
          display: flex;
          align-items: stretch;
          border: 1px solid var(--c-border);
          border-radius: var(--radius);
          background: var(--c-surface);
          cursor: pointer;
          transition: border-color 0.2s;
          overflow: hidden;
        }

        .library-card:hover {
          border-color: var(--c-border-light);
        }

        .card-content {
          flex: 1;
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          min-width: 0;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-3);
          min-height: 24px;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 300;
          color: var(--c-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }

        .card-title-input {
          flex: 1;
          background: var(--c-bg);
          border: 1px solid var(--c-accent);
          color: var(--c-text);
          font-family: var(--font-display);
          font-size: 1rem;
          padding: 2px 8px;
          border-radius: 4px;
          outline: none;
        }

        .card-date {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--c-text-dim);
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }

        .card-signal {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-style: italic;
          color: var(--c-text-muted);
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .card-tags {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .card-tag {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--c-accent);
          border: 1px solid rgba(200,169,110,0.3);
          padding: 1px var(--space-2);
          border-radius: 20px;
          letter-spacing: 0.08em;
        }

        .card-side-actions {
          display: flex;
          border-left: 1px solid var(--c-border);
        }

        .edit-btn, .delete-btn {
          width: 44px;
          background: transparent;
          border: none;
          color: var(--c-text-dim);
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.05em;
        }

        .edit-btn {
          border-right: 1px solid var(--c-border);
          font-size: 0.85rem;
        }

        .edit-btn:hover, .edit-btn.active {
          color: var(--c-accent);
          background: var(--c-accent-dim);
        }

        .delete-btn {
          font-size: 0.65rem;
        }

        .delete-btn:hover {
          color: #c97e7e;
          background: rgba(201,126,126,0.06);
        }

        .delete-btn.confirm {
          color: #c97e7e;
          background: rgba(201,126,126,0.06);
          font-size: 0.58rem;
          white-space: nowrap;
          width: auto;
          padding: 0 var(--space-3);
        }
      `}</style>
    </motion.div>
  )
}

