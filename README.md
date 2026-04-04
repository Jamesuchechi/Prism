# PRISM
### A Generative Thinking Tool

> *Put something messy in. PRISM breaks it into light.*

---

## What is PRISM?

PRISM is a single-page, AI-powered generative thinking tool that transforms raw, half-formed ideas into clarity and creative direction.

You bring anything — a word, a feeling, a problem, a fragment of thought. PRISM runs it through three stages of transformation and returns something you can actually **see, feel, and act on**.

It sits at the intersection of a **reframing engine**, a **personal insight extractor**, and a **creative direction generator** — unified into one cohesive, beautiful experience.

---

## The Three-Stage Flow

```
INPUT → [REFRACT] → [DISTILL] → [CRYSTALLIZE] → OUTPUT CARD
```

### Stage 1 — Refract
Your input is broken into **5 radical perspectives**:
- The Poet
- The Scientist
- The Child
- The Critic
- The Futurist

Each lens sees your idea differently. Together, they reveal its full surface area.

### Stage 2 — Distill
Across all five perspectives, PRISM finds the **real signal** — the underlying truth, the hidden pattern, the thing you were actually reaching for. This is the insight you didn't know you needed.

### Stage 3 — Crystallize
The distilled insight is transformed into a **creative brief**: a concept direction, a tone of voice, a palette rationale, and a set of reference directions. The fuzzy becomes actionable.

---

## Design Philosophy

PRISM is built around three principles:

**Minimal surface, maximum depth**
One input field. No menus, no settings, no clutter. The complexity lives in the output, not the interface.

**Progressive revelation**
Each stage reveals like something developing in a darkroom. You watch the idea become itself.

**Designed to be shared**
The final output is a beautiful card — exportable, shareable, worth keeping.

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: JavaScript (JSX)
- **Styling**: CSS Modules or plain CSS with custom properties
- **Animation**: Framer Motion
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`) via `api.anthropic.com/v1/messages`
- **Package manager**: npm
- **Storage**: None — stateless and ephemeral by design

### Project Structure
```
prism/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── prism.js          # All 3 API calls
│   ├── components/
│   │   ├── InputScreen.jsx
│   │   ├── StageRefract.jsx
│   │   ├── StageDistill.jsx
│   │   ├── StageCrystallize.jsx
│   │   └── OutputCard.jsx
│   ├── hooks/
│   │   └── usePrism.js       # Orchestrates the 3-stage flow
│   └── styles/
│       ├── globals.css
│       └── tokens.css        # Design tokens
└── .env                      # VITE_ANTHROPIC_API_KEY
```

---

## Who is PRISM for?

- **Creatives** who start with a feeling and need a direction
- **Thinkers** who want to see their idea from angles they hadn't considered
- **Writers, strategists, designers, founders** — anyone who works with half-formed things

---

## Status

> Currently in **Phase 1** of development. See `TODO.md` for the full build roadmap.