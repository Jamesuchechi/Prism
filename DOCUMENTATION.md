# PRISM — Technical Documentation

---

## Architecture Overview

PRISM is a **React + Vite SPA** powered by the Anthropic API. There is no backend, no database, no authentication layer. State lives entirely in React, API calls go directly from the browser to Anthropic.

```
┌──────────────────────────────────────────────────────┐
│                     BROWSER (React)                  │
│                                                      │
│  ┌─────────────┐    ┌────────────────────────────┐  │
│  │ InputScreen │───▶│     usePrism() hook        │  │
│  └─────────────┘    │  orchestrates 3 API calls  │  │
│                     └──────────────┬───────────────┘  │
│                                    │                  │
│               ┌────────────────────▼───────────────┐ │
│               │        Anthropic API               │ │
│               │   /v1/messages  ×3  sequential     │ │
│               └────────────────────┬───────────────┘ │
│                                    │                  │
│  ┌──────────────────────────────────▼─────────────┐  │
│  │  StageRefract → StageDistill → StageCrystallize│  │
│  │              → OutputCard                      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 18 | Component-based UI states, hooks for async flow |
| Build tool | Vite | Instant HMR, zero config, fast cold start |
| Animation | Framer Motion | Staggered reveals, layout animations, exit transitions |
| Styling | CSS custom properties + plain CSS | Full control, no runtime overhead |
| API | Anthropic `/v1/messages` | Direct browser fetch, no proxy needed |
| Env | `.env` via Vite | `VITE_ANTHROPIC_API_KEY` exposed to client safely in dev |

## Project Structure

```
prism/
├── index.html
├── vite.config.js
├── package.json
├── .env                       # VITE_ANTHROPIC_API_KEY
├── src/
│   ├── main.jsx               # React root
│   ├── App.jsx                # State machine: idle → refracting → distilling → crystallizing → complete
│   ├── api/
│   │   └── prism.js           # refract(), distill(), crystallize() — all 3 API calls
│   ├── components/
│   │   ├── InputScreen.jsx    # Landing, text input, run button
│   │   ├── StageRefract.jsx   # 5 perspective cards, staggered reveal
│   │   ├── StageDistill.jsx   # Signal block, word-by-word reveal
│   │   ├── StageCrystallize.jsx # Creative brief: concept, tone, palette, directions
│   │   └── OutputCard.jsx     # Composed full output, copy + reset actions
│   ├── hooks/
│   │   └── usePrism.js        # Orchestrates the 3-stage async flow
│   └── styles/
│       ├── globals.css        # Reset, base styles
│       └── tokens.css         # Design tokens (colors, type, spacing, easing)
```

## State Machine (App.jsx)

```
idle → refracting → distilling → crystallizing → complete
            ↓             ↓              ↓
          error         error          error
            └─────────────┴──────────────┘
                          ↓
                      (retry from failed stage)
```

## Environment Setup

```bash
# Install
npm create vite@latest prism -- --template react
cd prism
npm install framer-motion

# .env
VITE_ANTHROPIC_API_KEY=your_key_here

# Dev
npm run dev

# Build
npm run build
```

---

## API Integration

### Endpoint
```
POST https://api.anthropic.com/v1/messages
```

### Model
```
claude-sonnet-4-20250514
```

### Request Structure (per stage)
```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 1000,
  messages: [
    { role: "user", content: "<stage-specific prompt>" }
  ]
}
```

### Response Handling
```javascript
const data = await response.json();
const text = data.content
  .map(item => item.type === "text" ? item.text : "")
  .join("\n");
```

---

## The Three API Calls

### Call 1 — Refract
**Purpose**: Generate 5 perspective-based reframings of the input.

**Prompt template**:
```
You are PRISM, a thinking tool. The user has given you this input:

"{{USER_INPUT}}"

Reframe this through exactly 5 lenses. For each lens, give a 2–3 sentence
reframing. Be poetic, precise, and surprising. Do not be generic.

Lenses: The Poet, The Scientist, The Child, The Critic, The Futurist.

Respond in JSON only:
{
  "perspectives": [
    { "lens": "The Poet", "text": "..." },
    { "lens": "The Scientist", "text": "..." },
    { "lens": "The Child", "text": "..." },
    { "lens": "The Critic", "text": "..." },
    { "lens": "The Futurist", "text": "..." }
  ]
}
```

---

### Call 2 — Distill
**Purpose**: Find the underlying truth across all five perspectives.

**Prompt template**:
```
You are PRISM. Here is an original idea and 5 perspectives on it:

Original: "{{USER_INPUT}}"

Perspectives:
{{PERSPECTIVES_TEXT}}

Now distill these into the real signal — the hidden truth underneath all of them.
This is not a summary. It's the insight the person didn't know they were reaching for.
Write 3–4 sentences. Be precise, honest, a little surprising.

Respond in JSON only:
{
  "signal": "..."
}
```

---

### Call 3 — Crystallize
**Purpose**: Transform the signal into a usable creative brief.

**Prompt template**:
```
You are PRISM. Here is an insight that has emerged from a thinking process:

"{{SIGNAL}}"

Turn this into a creative brief with exactly these fields:
- concept: a one-line directional statement
- tone: 3 words that describe the feeling/voice
- palette: 3 colors (as hex codes) with a one-sentence rationale
- directions: 3 short reference directions (think: mood, not medium)

Respond in JSON only:
{
  "concept": "...",
  "tone": ["...", "...", "..."],
  "palette": [
    { "hex": "#...", "name": "...", "rationale": "..." },
    { "hex": "#...", "name": "...", "rationale": "..." },
    { "hex": "#...", "name": "...", "rationale": "..." }
  ],
  "directions": ["...", "...", "..."]
}
```

---

## UI States

| State | Description |
|-------|-------------|
| `idle` | Input field visible, prompt shown |
| `refracting` | Stage 1 running — perspectives loading in |
| `distilling` | Stage 2 running — signal emerging |
| `crystallizing` | Stage 3 running — brief forming |
| `complete` | Output card fully rendered |
| `error` | API failure — message shown, retry available |

---

## Output Card Structure

The final output card contains:

```
┌─────────────────────────────────────┐
│  PRISM OUTPUT                       │
│  ─────────────────────────────────  │
│  INPUT: "[original text]"           │
│                                     │
│  ◈ REFRACT                          │
│  The Poet     │ ...                 │
│  The Scientist│ ...                 │
│  The Child    │ ...                 │
│  The Critic   │ ...                 │
│  The Futurist │ ...                 │
│                                     │
│  ◈ SIGNAL                           │
│  [distilled insight paragraph]      │
│                                     │
│  ◈ BRIEF                            │
│  Concept  │ ...                     │
│  Tone     │ word · word · word      │
│  Palette  │ ██ ██ ██                │
│  Dirs     │ · ... · ... · ...       │
│                                     │
│  [Copy]  [New Input]                │
└─────────────────────────────────────┘
```

---

## Error Handling

- All three API calls wrapped in `try/catch`
- JSON responses stripped of markdown fences before parsing
- If any stage fails: surface error, allow retry from that stage
- Graceful degradation: if Stage 3 fails, Stages 1 & 2 still display

---

## Design Tokens

```css
:root {
  /* Typography */
  --font-display: 'display font TBD at build time';
  --font-body: 'body font TBD at build time';

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;

  /* Animation */
  --ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-stage: 600ms;
}
```

Colors and palette will be defined at build time, committed to the aesthetic direction chosen during Phase 1.

---

## Constraints & Decisions

| Decision | Rationale |
|----------|-----------|
| Single HTML file | Zero setup, instantly shareable, runs anywhere |
| 3 sequential API calls | Clean separation of concerns; each stage is atomic |
| JSON-only API responses | Reliable parsing; avoids markdown noise in output |
| No local storage | Stateless by design — each PRISM session is fresh |
| No auth layer | MVP phase; API key handled by Anthropic infrastructure |