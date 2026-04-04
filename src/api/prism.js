const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant'
]

const OPENROUTER_MODELS = [
  'anthropic/claude-3.5-sonnet',
  'google/gemini-pro-1.5',
  'openai/gpt-4o-mini',
  'meta-llama/llama-3.1-405b-instruct',
  'google/gemini-flash-1.5-free'
]

async function callWithFallback(provider, models, prompt) {
  let lastError = null

  for (const model of models) {
    try {
      const url = provider === 'groq' ? GROQ_URL : OPENROUTER_URL
      const key = provider === 'groq' ? GROQ_KEY : OPENROUTER_KEY

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }

      // Add OpenRouter specific headers if needed
      if (provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.href
        headers['X-Title'] = 'PRISM'
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' } // Request JSON if supported
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message || `API error ${response.status} using ${model}`)
      }

      const data = await response.json()
      const text = data.choices[0].message.content

      // Strip markdown fences if any
      const clean = text.replace(/```json\n?|```\n?/g, '').trim()
      return JSON.parse(clean)

    } catch (err) {
      console.warn(`PRISM: ${model} failed. Trying next...`, err.message)
      lastError = err
      continue
    }
  }

  throw new Error(`PRISM: All models failed. Last error: ${lastError?.message}`)
}

// Stage 1 — Refract
export async function refract(input, lenses) {
  const lensInstructions = lenses && lenses.length === 5
    ? `Reframe this through exactly these 5 lenses: ${lenses.map(l => `"${l}"`).join(', ')}.`
    : `Reframe this through exactly 5 lenses. Be poetic, precise, and genuinely surprising. Avoid generic observations. Make each lens feel like a different world.`

  const prompt = `You are PRISM, a generative thinking tool. The user has given you this input:

"${input}"

${lensInstructions} For each lens, write 2–3 sentences. 

Respond in JSON only — no preamble, no markdown, no explanation:
{
  "perspectives": [
    { "lens": "Lens Name 1", "text": "..." },
    { "lens": "Lens Name 2", "text": "..." },
    { "lens": "Lens Name 3", "text": "..." },
    { "lens": "Lens Name 4", "text": "..." },
    { "lens": "Lens Name 5", "text": "..." }
  ]
}`

  return callWithFallback('groq', GROQ_MODELS, prompt)
}

// Stage 2 — Distill
export async function distill(input, perspectives) {
  const perspectivesText = perspectives
    .map(p => `${p.lens}: ${p.text}`)
    .join('\n\n')

  const prompt = `You are PRISM. Here is an original idea and 5 perspectives on it:

Original: "${input}"

Perspectives:
${perspectivesText}

Now distill these into the real signal — the underlying truth hidden beneath all five lenses. This is not a summary. It is the insight the person didn't know they were reaching for. It should feel like something clicking into place. Write 3–4 sentences. Be honest, precise, a little unexpected.

Respond in JSON only — no preamble, no markdown, no explanation:
{
  "signal": "..."
}`

  return callWithFallback('openrouter', OPENROUTER_MODELS, prompt)
}

// Stage 3 — Crystallize
export async function crystallize(signal) {
  const prompt = `You are PRISM. Here is an insight that has emerged from a thinking process:

"${signal}"

Transform this into a creative brief. Be specific, evocative, and directional — not generic.

Respond in JSON only — no preamble, no markdown, no explanation:
{
  "concept": "A single directional statement (one sentence, starts with a verb)",
  "tone": ["word1", "word2", "word3"],
  "palette": [
    { "hex": "#xxxxxx", "name": "Short name", "rationale": "One sentence why this color." },
    { "hex": "#xxxxxx", "name": "Short name", "rationale": "One sentence why this color." },
    { "hex": "#xxxxxx", "name": "Short name", "rationale": "One sentence why this color." }
  ],
  "directions": [
    "A short evocative reference direction (mood, not medium)",
    "A short evocative reference direction (mood, not medium)",
    "A short evocative reference direction (mood, not medium)"
  ]
}`

  return callWithFallback('openrouter', OPENROUTER_MODELS, prompt)
}