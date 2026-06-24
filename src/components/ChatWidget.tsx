import { useEffect } from 'react'

type Props = {
  business?: any
  color?: string
  businessId?: string
}

export function ChatWidget({ businessId }: Props) {
  useEffect(() => {
    if (!businessId) return

    // Clean up any existing widget
    document.getElementById('desklo-widget')?.remove()
    document.getElementById('desklo-widget-script')?.remove()
    document.getElementById('desklo-widget-style')?.remove()

    // Set business key
    ;(window as any).DESKLO_KEY = businessId

    const script = document.createElement('script')
    script.id = 'desklo-widget-script'
    script.src = `/widget.js?v=${Date.now()}`
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.getElementById('desklo-widget')?.remove()
      document.getElementById('desklo-widget-script')?.remove()
      document.getElementById('desklo-widget-style')?.remove()
      delete (window as any).DESKLO_KEY
    }
  }, [businessId])

  return null
}