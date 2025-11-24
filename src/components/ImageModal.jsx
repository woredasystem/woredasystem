import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function ImageModal({ imageUrl, alt, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden' // Prevent background scrolling
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!imageUrl) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-mayor-navy p-3 rounded-full shadow-gov-md transition-all z-10"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Image at Original Size */}
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'auto',
          height: 'auto'
        }}
      />
    </div>
  )
}

