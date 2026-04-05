import { useState, useEffect } from 'react'

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (standalone) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const promptInstall = async () => {
    if (!installPrompt) return false
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setIsInstalled(true)
    }
    return outcome === 'accepted'
  }

  const canInstall = !isInstalled && (!!installPrompt || isIOS)

  return { canInstall, isInstalled, isIOS, promptInstall }
}
