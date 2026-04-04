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

## Phase 1 — Core Build ✦ *[UP NEXT]*

> Goal: A working React + Vite app with all three stages functional.

### 1.0 — Project Setup
- [ ] `npm create vite@latest prism -- --template react`
- [ ] Install dependencies: `framer-motion`
- [ ] Set up `.env` with `VITE_ANTHROPIC_API_KEY`
- [ ] Create folder structure: `api/`, `components/`, `hooks/`, `styles/`
- [ ] Set up `tokens.css` and `globals.css`
- [ ] Confirm `npm run dev` works

### 1.1 — Aesthetic Direction
- [ ] Commit to a visual identity (typography, color, tone)
- [ ] Define design tokens in `tokens.css`
- [ ] Sketch component hierarchy and layout

### 1.2 — Input Layer (`InputScreen.jsx`)
- [ ] Single textarea, minimal label, one action button
- [ ] `Cmd/Ctrl + Enter` keyboard shortcut to run
- [ ] Character count indicator (subtle)
- [ ] Framer Motion entrance animation

### 1.3 — Stage 1: Refract (`StageRefract.jsx`)
- [ ] Write and test the Refract prompt in `prism.js`
- [ ] Parse JSON response safely
- [ ] Staggered card reveals with Framer Motion
- [ ] Error boundary for Stage 1

### 1.4 — Stage 2: Distill (`StageDistill.jsx`)
- [ ] Write and test the Distill prompt (passes perspectives as context)
- [ ] Parse JSON response safely
- [ ] Animate signal text reveal
- [ ] Error boundary for Stage 2

### 1.5 — Stage 3: Crystallize (`StageCrystallize.jsx`)
- [ ] Write and test the Crystallize prompt (passes signal as context)
- [ ] Parse JSON response safely
- [ ] Render palette swatches from hex values
- [ ] Render concept, tone words, directions
- [ ] Error boundary for Stage 3

### 1.6 — `usePrism.js` Hook
- [ ] Orchestrate the 3-stage async flow
- [ ] Manage state: `{ status, input, perspectives, signal, brief, error }`
- [ ] Expose `run(input)` and `reset()` functions

### 1.7 — Output Card (`OutputCard.jsx`)
- [ ] Compose full output from all three stages
- [ ] "Copy to clipboard" (formatted plain text)
- [ ] "New input" resets to idle via `reset()`
- [ ] Loading skeleton per section

---

## Phase 2 — Polish & Craft ✦ *[after Phase 1 is solid]*

> Goal: Make it feel inevitable. Every detail intentional.

### 2.1 — Motion & Reveals
- [ ] Staggered entrance animations for perspective cards
- [ ] Signal text types in progressively (character by character or word by word)
- [ ] Brief crystallizes section by section with subtle delay
- [ ] Smooth state transitions between stages (no jarring repaints)

### 2.2 — Typography & Layout
- [ ] Fine-tune spacing, leading, tracking for every text element
- [ ] Verify hierarchy reads correctly at all three stages
- [ ] Ensure output card is visually printable / screenshot-worthy

### 2.3 — Micro-interactions
- [ ] Input field: subtle focus glow or border animation
- [ ] Button hover states with intention (not just color change)
- [ ] Palette swatches: hover to see hex + rationale tooltip
- [ ] Copy button: success state ("Copied ✓") with fade-back

### 2.4 — Edge Cases
- [ ] Very short inputs (single word) — test quality
- [ ] Very long inputs (paragraph+) — test quality + layout
- [ ] Non-English inputs — test model behavior
- [ ] API timeout handling (>15s) — show friendly message

---

## Phase 3 — Shareability ✦ *[stretch]*

> Goal: Make outputs worth sharing and returning to.

- [ ] Export output as a styled PNG image (via `html2canvas` or similar)
- [ ] "Share as link" — encode state in URL hash (base64 compressed)
- [ ] Optional: dark/light mode toggle
- [ ] Optional: save to local history (last 5 PRISMs, stored in-memory per session)

---

## Phase 4 — Expand (if it resonates) ✦ *[future thinking]*

> Only pursue if Phase 1–2 feel truly right.

- [ ] Custom lenses: let the user define their own perspective names
- [ ] "Lens library": curated sets (Startup, Philosophical, Sensory, etc.)
- [ ] Multi-input: run two ideas through PRISM and compare outputs
- [ ] "Remix": take someone else's PRISM output as your starting input
- [ ] Mobile-first redesign pass

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
- [ ] Any input produces a full three-stage output without errors
- [ ] The UI feels editorial and intentional (not generic)
- [ ] The output card is legible, beautiful, and copyable
- [ ] It works in Chrome, Firefox, and Safari
- [ ] Someone who sees it for the first time says *"wait, what is this?"*