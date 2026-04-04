import LZString from 'lz-string'
import { useCallback } from 'react'

export function useShare() {
  const encodeState = useCallback((state) => {
    try {
      const json = JSON.stringify({
        input: state.input,
        perspectives: state.perspectives,
        signal: state.signal,
        brief: state.brief
      })
      // Compress and encode to be URL safe
      const compressed = LZString.compressToEncodedURIComponent(json)
      const url = new URL(window.location.href)
      url.hash = `share=${compressed}`
      return url.toString()
    } catch (err) {
      console.error('PRISM: Failed to encode state', err)
      return null
    }
  }, [])

  const decodeState = useCallback(() => {
    try {
      const hash = window.location.hash
      if (!hash.startsWith('#share=')) return null

      const compressed = hash.replace('#share=', '')
      const json = LZString.decompressFromEncodedURIComponent(compressed)
      if (!json) return null

      return JSON.parse(json)
    } catch (err) {
      console.error('PRISM: Failed to decode state', err)
      return null
    }
  }, [])

  return { encodeState, decodeState }
}
