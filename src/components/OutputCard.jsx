import { useState } from 'react'
import { motion } from 'framer-motion'
import { domToPng } from 'modern-screenshot'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useShare } from '../hooks/useShare'

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

export default function OutputCard({ input, perspectives, signal, brief, onReset, onRemix }) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [exporting, setExporting] = useState(false)
  
  const { playClick, playSuccess } = useSoundEffects()
  const { encodeState } = useShare()

  const handleCopy = async () => {
    playClick()
    const text = buildCopyText({ input, perspectives, signal, brief })
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLink = async () => {
    playClick()
    const url = encodeState({ input, perspectives, signal, brief })
    if (url) {
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
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
        
        <button className="action-btn share-btn" onClick={handleShareLink}>
          {shared ? '✓ Link Copied' : 'Share Link'}
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
      `}</style>
    </motion.div>
  )
}