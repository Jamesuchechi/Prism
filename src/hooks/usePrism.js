import { useState, useCallback } from 'react'
import { refract, distill, crystallize } from '../api/prism'

const INITIAL_STATE = {
  status: 'idle',       // idle | refracting | distilling | crystallizing | complete | error
  input: '',
  perspectives: null,
  signal: null,
  brief: null,
  error: null,
  errorStage: null,
}

export function usePrism() {
  const [state, setState] = useState(INITIAL_STATE)

  const set = (patch) => setState(prev => ({ ...prev, ...patch }))

  const run = useCallback(async (input) => {
    set({ status: 'refracting', input, perspectives: null, signal: null, brief: null, error: null, errorStage: null })

    // Stage 1 — Refract
    let perspectives
    try {
      const result = await refract(input)
      perspectives = result.perspectives
      set({ perspectives, status: 'distilling' })
    } catch (err) {
      set({ status: 'error', error: err.message, errorStage: 'refract' })
      return
    }

    // Stage 2 — Distill
    let signal
    try {
      const result = await distill(input, perspectives)
      signal = result.signal
      set({ signal, status: 'crystallizing' })
    } catch (err) {
      set({ status: 'error', error: err.message, errorStage: 'distill' })
      return
    }

    // Stage 3 — Crystallize
    try {
      const brief = await crystallize(signal)
      set({ brief, status: 'complete' })
    } catch (err) {
      set({ status: 'error', error: err.message, errorStage: 'crystallize' })
    }
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const retry = useCallback(async () => {
    if (!state.errorStage || !state.input) return

    if (state.errorStage === 'refract') {
      run(state.input)
    } else if (state.errorStage === 'distill') {
      set({ status: 'distilling', error: null, errorStage: null })
      try {
        const result = await distill(state.input, state.perspectives)
        const signal = result.signal
        set({ signal, status: 'crystallizing' })
        const brief = await crystallize(signal)
        set({ brief, status: 'complete' })
      } catch (err) {
        set({ status: 'error', error: err.message, errorStage: 'distill' })
      }
    } else if (state.errorStage === 'crystallize') {
      set({ status: 'crystallizing', error: null, errorStage: null })
      try {
        const brief = await crystallize(state.signal)
        set({ brief, status: 'complete' })
      } catch (err) {
        set({ status: 'error', error: err.message, errorStage: 'crystallize' })
      }
    }
  }, [state, run])

  return { ...state, run, reset, retry }
}