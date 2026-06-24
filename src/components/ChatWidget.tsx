import { useEffect, useRef } from 'react'

type Props = {
  business?: any
  color?: string
  businessId?: string
}

export function ChatWidget({ businessId }: Props) {
  const injected = useRef(false)

  useEffect(() => {
    if (!businessId || injected.current) return
    injected.current = true

    // Remove any existing desklo widget
    const existing = document.getElementById('desklo-widget')
    if (existing) existing.remove()

    // Remove existing widget script
    const existingScript = document.getElementById('desklo-widget-script')
    if (existingScript) existingScript.remove()

    // Set the business key FIRST
    ;(window as any).DESKLO_KEY = businessId

    // Small delay to ensure DESKLO_KEY is set before widget loads
    setTimeout(() => {
      const script = document.createElement('script')
      script.id = 'desklo-widget-script'
      script.src = `/widget.js?v=${Date.now()}`
      script.async = true
      document.body.appendChild(script)
    }, 100)

    return () => {
      const w = document.getElementById('desklo-widget')
      if (w) w.remove()
      const s = document.getElementById('desklo-widget-script')
      if (s) s.remove()
      delete (window as any).DESKLO_KEY
      injected.current = false
    }
  }, [businessId])

  return null
}