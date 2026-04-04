import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoundEffects } from '../hooks/useSoundEffects'

const LENS_PRESETS = [
  { id: 'auto', name: 'Auto', lenses: null },
  { id: 'creative', name: 'Creative', lenses: ["The Poet", "The Architect", "The Provocateur", "The Child", "The Curator"] },
  { id: 'philosophical', name: 'Philosophical', lenses: ["The Existentialist", "The Stoic", "The Nihilist", "The Idealist", "The Hedonist"] },
  { id: 'futurist', name: 'Futurist', lenses: ["The Prophet", "The Engineer", "The Cynic", "The Accelerant", "The Historian"] },
  { id: 'strategic', name: 'Strategic', lenses: ["The Disruptor", "The Incumbent", "The User", "The Shareholder", "The Regulator"] },
  { id: 'custom', name: 'Custom', lenses: [] }
]

export default function LensSelector({ activeLenses, onSelect }) {
  const [selectedId, setSelectedId] = useState('auto')
  const [customLenses, setCustomLenses] = useState(['', '', '', '', ''])
  const { playClick } = useSoundEffects()

  const handleSelect = (preset) => {
    playClick()
    setSelectedId(preset.id)
    if (preset.id !== 'custom') {
      onSelect(preset.lenses)
    }
  }

  const handleCustomChange = (index, value) => {
    const next = [...customLenses]
    next[index] = value
    setCustomLenses(next)
    
    // Only fire update if all 5 are filled
    if (next.every(l => l.trim().length > 0)) {
      onSelect(next)
    } else {
      onSelect(null) // Reset to auto if incomplete custom
    }
  }

  return (
    <div className="lens-selector">
      <div className="preset-group">
        {LENS_PRESETS.map(preset => (
          <button
            key={preset.id}
            className={`preset-btn ${selectedId === preset.id ? 'active' : ''}`}
            onClick={() => handleSelect(preset)}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedId === 'custom' && (
          <motion.div
            className="custom-input-grid"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="custom-inputs">
              {customLenses.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Lens ${i + 1}`}
                  value={val}
                  onChange={(e) => handleCustomChange(i, e.target.value)}
                  className="custom-lens-input"
                />
              ))}
            </div>
            <p className="custom-hint">Define 5 perspectives to refract through.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .lens-selector {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: 100%;
        }

        .preset-group {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .preset-btn {
          background: transparent;
          border: 1px solid var(--c-border);
          color: var(--c-text-muted);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          padding: 4px var(--space-3);
          border-radius: 20px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
        }

        .preset-btn:hover {
          border-color: var(--c-text-muted);
          color: var(--c-text);
        }

        .preset-btn.active {
          background: var(--c-text);
          border-color: var(--c-text);
          color: var(--c-bg);
        }

        .custom-input-grid {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .custom-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: var(--space-2);
        }

        .custom-lens-input {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          color: var(--c-text);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius);
          outline: none;
          transition: border-color 0.2s;
        }

        .custom-lens-input:focus {
          border-color: var(--c-accent);
        }

        .custom-hint {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--c-text-dim);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}
