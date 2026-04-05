import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useSave() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedId, setSavedId] = useState(null)
  const [error, setError] = useState(null)

  const save = useCallback(async ({ input, perspectives, signal, brief }) => {
    if (!user) return { needsAuth: true }

    setSaving(true)
    setError(null)

    const title = input.length > 40 ? input.slice(0, 40) + '…' : input

    const { data, error } = await supabase
      .from('prisms')
      .insert({
        user_id: user.id,
        input,
        perspectives,
        signal,
        brief,
        title,
      })
      .select('id')
      .single()

    setSaving(false)

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    setSaved(true)
    setSavedId(data.id)
    return { id: data.id }
  }, [user])

  const reset = useCallback(() => {
    setSaved(false)
    setSavedId(null)
    setError(null)
  }, [])

  return { save, saving, saved, savedId, error, reset }
}
