import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function generateToken() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function useShare() {
  const [sharing, setSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)
  const [error, setError] = useState(null)

  const share = useCallback(async (prismId) => {
    setSharing(true)
    setError(null)

    const token = generateToken()

    const { error } = await supabase
      .from('prisms')
      .update({ share_token: token })
      .eq('id', prismId)

    setSharing(false)

    if (error) {
      setError(error.message)
      return null
    }

    const url = `${window.location.origin}/p/${token}`
    setShareUrl(url)

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
    } catch {}

    return url
  }, [])

  const revoke = useCallback(async (prismId) => {
    const { error } = await supabase
      .from('prisms')
      .update({ share_token: null })
      .eq('id', prismId)

    if (!error) setShareUrl(null)
    return !error
  }, [])

  return { share, revoke, sharing, shareUrl, error }
}
