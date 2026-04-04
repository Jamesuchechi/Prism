# PRISM — Build Phases & TODO

> Minimal yet powerful. Ship with craft. Experiment with intention.

---

## Phase 0 — Foundation ✦ *[COMPLETE — planning]*

- [x] Define concept: generative thinking tool
- [x] Name the product: PRISM
- [x] Define the three-stage flow: Refract → Distill → Crystallize
- [x] Write README.md
- [x] Write DOCUMENTATION.md
- [x] Write TODO.md (this file)

---

## Phase 1 — Core Build ✦ *[COMPLETE]*

> Goal: A working React + Vite app with all three stages functional.

### 1.0 — Project Setup
- [x] `npm create vite@latest prism -- --template react`
- [x] Install dependencies: `framer-motion`
- [x] Set up `.env` with `VITE_OPENROUTER_API_KEY` and `VITE_GROQ_API_KEY`
- [x] Create folder structure: `api/`, `components/`, `hooks/`, `styles/`
- [x] Set up `tokens.css` and `globals.css`
- [x] Confirm `npm run dev` works

### 1.1 — Aesthetic Direction
- [x] Commit to a visual identity (typography, color, tone)
- [x] Define design tokens in `tokens.css`
- [x] Sketch component hierarchy and layout

### 1.2 — Input Layer (`InputScreen.jsx`)
- [x] Single textarea, minimal label, one action button
- [x] `Cmd/Ctrl + Enter` keyboard shortcut to run
- [x] Character count indicator (subtle)
- [x] Framer Motion entrance animation

### 1.3 — Stage 1: Refract (`StageRefract.jsx`)
- [x] Write and test the Refract prompt in `prism.js`
- [x] Parse JSON response safely (with multi-model fallback)
- [x] Staggered card reveals with Framer Motion
- [ ] Error boundary for Stage 1 (Global catch-all exists)

### 1.4 — Stage 2: Distill (`StageDistill.jsx`)
- [x] Write and test the Distill prompt (passes perspectives as context)
- [x] Parse JSON response safely (with multi-model fallback)
- [x] Animate signal text reveal
- [ ] Error boundary for Stage 2 (Global catch-all exists)

### 1.5 — Stage 3: Crystallize (`StageCrystallize.jsx`)
- [x] Write and test the Crystallize prompt (passes signal as context)
- [x] Parse JSON response safely (with multi-model fallback)
- [x] Render palette swatches from hex values
- [x] Render concept, tone words, directions
- [ ] Error boundary for Stage 3 (Global catch-all exists)

### 1.6 — `usePrism.js` Hook
- [x] Orchestrate the 3-stage async flow
- [x] Manage state: `{ status, input, perspectives, signal, brief, error }`
- [x] Expose `run(input)` and `reset()` functions

### 1.7 — Output Card (`OutputCard.jsx`)
- [x] Compose full output from all three stages
- [x] "Copy to clipboard" (formatted plain text)
- [x] "New input" resets to idle via `reset()`
- [x] Loading skeleton per section

---

## Phase 2 — Polish & Craft ✦ *[COMPLETE]*

> Goal: Make it feel inevitable. Every detail intentional.

### 2.1 — Motion & Reveals
- [x] Staggered entrance animations for perspective cards
- [x] Signal text types in progressively (character by character)
- [x] Brief crystallizes section by section with subtle delay
- [x] Smooth state transitions between stages (and sonic transitions)

### 2.2 — Typography & Layout
- [x] Fine-tune spacing, leading, tracking for every text element
- [x] Verify hierarchy reads correctly at all three stages
- [x] Ensure output card is visually printable / screenshot-worthy

### 2.3 — Micro-interactions
- [x] Input field: subtle focus glow and sound triggers
- [x] Button hover states with intention
- [x] Palette swatches: hover to see hex + rationale tooltip
- [x] Copy button: success state ("✓ Copied") with tactile feedback

### 2.4 — Edge Cases
- [x] Very short inputs (handled via prompts and length limits)
- [x] Very long inputs (max-length 500 characters)
- [x] Non-English inputs (leveraging LLM multilingual capabilities)
- [x] API timeout/fail handling (multi-model fallback logic)

---

## Phase 3 — Shareability ✦ *[COMPLETE]*

> Goal: Make outputs worth sharing and returning to.

- [x] Export output as a 2x PNG image (via `modern-screenshot`)
- [x] "Share as link" — encode state in URL hash (LZ-String compressed)
- [x] State hydration: loading shared links automatically restores results
- [x] Phase 4: Mobile Responsiveness — fluid typography and stacking
- [x] Phase 5: Light & Dark Mode — Obsidian & Paper themes
- [x] Phase 6: Session History — Save last 5 thoughts in-memory

---

## Phase 4 — Expand (if it resonates) ✦ *[future thinking]*

> Only pursue if Phase 1–2 feel truly right.

- [x] Custom lenses: let the user define their own perspective names
- [x] "Lens library": curated sets (Startup, Philosophical, Sensory, etc.)
- [x] Multi-input: run two ideas through PRISM and compare outputs
- [x] "Remix": take someone else's PRISM output as your starting input
- [x] Mobile-first redesign pass

---

## Known Constraints

| Constraint | Note |
|------------|------|
| 3 sequential API calls | Adds latency (~6–12s total). Acceptable for Phase 1; explore streaming in Phase 2 |
| JSON parsing | Fragile if model adds preamble — strip fences aggressively |
| Single file | Limits code organization but maximizes portability |
| No persistence | Feature, not a bug — for now |

---

## Definition of Done (Phase 1)

PRISM Phase 1 is **done** when:
- [x] Any input produces a full three-stage output without errors
- [x] The UI feels editorial and intentional (not generic)
- [x] The output card is legible, beautiful, and copyable
- [x] It works in Chrome, Firefox, and Safari
- [x] Someone who sees it for the first time says *"wait, what is this?"*