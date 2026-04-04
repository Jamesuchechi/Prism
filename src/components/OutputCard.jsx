import { useState } from 'react'
import { motion } from 'framer-motion'

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

export default function OutputCard({ input, perspectives, signal, brief, onReset }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = buildCopyText({ input, perspectives, signal, brief })
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

      <div className="action-btns">
        <button className="action-btn copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy output'}
        </button>
        <button className="action-btn reset-btn" onClick={onReset}>
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

        .action-btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
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
        }

        .copy-btn {
          background: transparent;
          border: 1px solid var(--c-border-light);
          color: var(--c-text-muted);
        }

        .copy-btn:hover {
          border-color: var(--c-accent);
          color: var(--c-accent);
          background: var(--c-accent-dim);
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