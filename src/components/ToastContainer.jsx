import { useState, useEffect, useCallback } from 'react'
import Toast from './Toast'

// Global toast state
let toastId = 0
let setToastsState = null

export function showToast(message, type = 'success', duration = 5000, showCopyButton = false, copyText = '') {
  const id = toastId++
  if (setToastsState) {
    setToastsState((prev) => [...prev, { id, message, type, duration, showCopyButton, copyText }])
  }
  return id
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    setToastsState = setToasts
    return () => {
      setToastsState = null
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-[100] space-y-3 max-w-full md:max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          showCopyButton={toast.showCopyButton}
          copyText={toast.copyText}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

