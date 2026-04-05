import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { domToPng } from 'modern-screenshot'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useShare } from '../hooks/useShare'
import { useSave } from '../hooks/useSave'
import { useAuth } from '../context/AuthContext'

function buildCopyText({ input, perspectives, signal, brief }) {
  const lines = []
  lines.push('PRISM OUTPUT')
  lines.push('═'.repeat(40))
  lines.push(`INPUT: "${input}"`)
  lines.push('')
  lines.push('◈ REFRACT')
  perspectives?.forEach(p => {
    lines.push(`\n${p.lens}`)
    lines.push(p.text)
  })
  lines.push('')
  lines.push('◈ DISTILL — THE SIGNAL')
  lines.push(signal || '')
  lines.push('')
  lines.push('◈ CRYSTALLIZE — CREATIVE BRIEF')
  lines.push(`Concept: ${brief?.concept || ''}`)
  lines.push(`Tone: ${brief?.tone?.join(' · ') || ''}`)
  lines.push(`Palette: ${brief?.palette?.map(s => `${s.name} ${s.hex}`).join(', ') || ''}`)
  lines.push('Directions:')
  brief?.directions?.forEach(d => lines.push(`  — ${d}`))
  return lines.join('\n')
}

export default function OutputCard({ input, perspectives, signal, brief, onReset, onRemix, onAuthRequired }) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [exporting, setExporting] = useState(false)
  
  const { playClick, playSuccess } = useSoundEffects()
  const { share, sharing, shareUrl } = useShare()
  const { save, saving, saved, savedId, error: saveError, reset: resetSave } = useSave()
  const { user } = useAuth()

  useEffect(() => {
    resetSave()
  }, [input, perspectives, signal, brief, resetSave])

  const handleCopy = async () => {
    playClick()
    const text = buildCopyText({ input, perspectives, signal, brief })
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    playClick()
    const res = await save({ input, perspectives, signal, brief })
    if (res?.needsAuth) {
      onAuthRequired('Sign in to save this PRISM to your library.')
    } else if (res?.id) {
      playSuccess()
    }
  }

  const handleShareLink = async () => {
    playClick()
    
    let currentId = savedId
    if (!currentId) {
      const res = await save({ input, perspectives, signal, brief })
      if (res?.needsAuth) {
        onAuthRequired('Sign in to share a permanent link for this PRISM.')
        return
      }
      if (res?.id) currentId = res.id
    }

    if (currentId) {
      const url = await share(currentId)
      if (url) {
        setShared(true)
        setTimeout(() => setShared(false), 3000)
        playSuccess()
      }
    }
  }

  const handleExportPng = async () => {
    const el = document.getElementById('prism-results')
    if (!el) return

    setExporting(true)
    playClick()
    
    try {
      const dataUrl = await domToPng(el, {
        scale: 2,
        backgroundColor: '#0a0a08',
        style: {
          padding: '40px',
          borderRadius: '0'
        }
      })
      
      const link = document.createElement('a')
      link.download = `prism-${input.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
      playSuccess()
    } catch (err) {
      console.error('PRISM: Export failed', err)
    } finally {
      setExporting(false)
    }
  }

  const handleReset = () => {
    playClick()
    onReset()
  }

  const handleRemix = () => {
    playClick()
    onRemix(signal)
  }

  return (
    <motion.div
      className="output-actions"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="output-complete-badge">
        <span className="badge-dot" />
        <span>PRISM complete</span>
      </div>

      <div className="action-btns-grid">
        <button className="action-btn copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy Text'}
        </button>
        
        <button 
          className={`action-btn save-btn ${saved ? 'saved' : ''}`} 
          onClick={handleSave}
          disabled={saving || saved}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save to Library'}
        </button>

        <button 
          className="action-btn share-btn" 
          onClick={handleShareLink}
          disabled={sharing}
        >
          {sharing ? 'Sharing...' : shared ? '✓ Link Copied' : 'Share Link'}
        </button>

        <button 
          className="action-btn export-btn" 
          onClick={handleExportPng}
          disabled={exporting}
        >
          {exporting ? 'Preparing...' : 'Export PNG'}
        </button>

        <button className="action-btn remix-btn" onClick={handleRemix}>
          Remix Signal
        </button>

        <button className="action-btn reset-btn" onClick={handleReset}>
          New input →
        </button>
      </div>

      <AnimatePresence>
        {saveError && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="save-error"
          >
            {saveError}
          </motion.p>
        )}
      </AnimatePresence>


      <style>{`
        .output-actions {
          width: 100%;
          max-width: var(--max-w);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid var(--c-border);
        }

        .output-complete-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-mono);
          font-size: 0.63rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--c-text-muted);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--c-accent);
          box-shadow: 0 0 8px var(--c-accent);
          flex-shrink: 0;
        }

        .action-btns-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
        }

        @media (max-width: 480px) {
          .action-btns-grid {
            grid-template-columns: 1fr;
          }
        }

        .action-btn {
          padding: var(--space-4) var(--space-5);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          border: 1px solid var(--c-border-light);
          background: transparent;
          color: var(--c-text-muted);
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .action-btn {
            padding: var(--space-3) var(--space-4);
            font-size: 0.65rem;
          }
        }

        .action-btn:hover:not(:disabled) {
          border-color: var(--c-accent);
          color: var(--c-accent);
          background: var(--c-accent-dim);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .reset-btn {
          background: var(--c-accent);
          border: 1px solid var(--c-accent);
          color: var(--c-bg);
          font-weight: 400;
        }

        .reset-btn:hover {
          background: transparent;
          color: var(--c-accent);
        }

        .save-btn.saved {
          background: rgba(200, 169, 110, 0.1);
          border-color: var(--c-accent);
          color: var(--c-accent);
          cursor: default;
        }

        .save-error {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #c97e7e;
          text-align: center;
          margin-top: var(--space-2);
          letter-spacing: 0.05em;
        }
      `}</style>

    </motion.div>
  )
}