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
  const [history, setHistory] = useState([])
  const [activeLenses, setActiveLenses] = useState(null)

  const set = (patch) => setState(prev => ({ ...prev, ...patch }))

  const addToHistory = useCallback((item) => {
    setHistory(prev => {
      // Don't add if the same input is already at the top
      if (prev.length > 0 && prev[0].input === item.input) return prev
      return [item, ...prev].slice(0, 5)
    })
  }, [])

  const run = useCallback(async (input, lenses) => {
    set({ status: 'refracting', input, perspectives: null, signal: null, brief: null, error: null, errorStage: null })
    const lensSet = lenses || activeLenses

    // Stage 1 — Refract
    let perspectives
    try {
      const result = await refract(input, lensSet)
      perspectives = result.perspectives
      set({ perspectives, status: 'distilling' })
    } catch (err) {
      set({ status: 'error', error: err.message, errorStage: 'refract' })
      return
    }
    
    // ... remaining stages stay same but use the variables set above
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
      addToHistory({ input, perspectives, signal, brief, timestamp: Date.now() })
    } catch (err) {
      set({ status: 'error', error: err.message, errorStage: 'crystallize' })
    }
  }, [activeLenses, addToHistory])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
    window.location.hash = '' // Clear share hash on reset
  }, [])

  const setInput = useCallback((input) => {
    setState(prev => ({ ...prev, input }))
  }, [])

  const hydrate = useCallback((data) => {
    const newState = {
      ...INITIAL_STATE,
      status: 'complete',
      input: data.input,
      perspectives: data.perspectives,
      signal: data.signal,
      brief: data.brief
    }
    setState(newState)
    addToHistory({ ...data, timestamp: data.timestamp || Date.now() })
  }, [addToHistory])

  const retry = useCallback(async () => {
    if (!state.errorStage || !state.input) return

    if (state.errorStage === 'refract') {
      run(state.input, activeLenses)
    } else if (state.errorStage === 'distill') {
      set({ status: 'distilling', error: null, errorStage: null })
      try {
        const result = await distill(state.input, state.perspectives)
        const signal = result.signal
        set({ signal, status: 'crystallizing' })
        const brief = await crystallize(signal)
        set({ brief, status: 'complete' })
        addToHistory({ input: state.input, perspectives: state.perspectives, signal, brief, timestamp: Date.now() })
      } catch (err) {
        set({ status: 'error', error: err.message, errorStage: 'distill' })
      }
    } else if (state.errorStage === 'crystallize') {
      set({ status: 'crystallizing', error: null, errorStage: null })
      try {
        const brief = await crystallize(state.signal)
        set({ brief, status: 'complete' })
        addToHistory({ 
          input: state.input, 
          perspectives: state.perspectives, 
          signal: state.signal, 
          brief, 
          timestamp: Date.now() 
        })
      } catch (err) {
        set({ status: 'error', error: err.message, errorStage: 'crystallize' })
      }
    }
  }, [state, run, addToHistory, activeLenses])

  return { ...state, run, reset, retry, hydrate, history, activeLenses, setActiveLenses, setInput }
}