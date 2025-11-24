import { Check, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { showToast } from './ToastContainer'

export default function ComplaintSuccessModal({ ticketNumber, uniqueCode, onClose }) {
  const { t, lang } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(uniqueCode)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = uniqueCode
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopied(true)
      showToast(
        lang === 'am' ? 'ኮድ ተቀድቷል!' : 'Code copied!',
        'success',
        2000
      )
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
      showToast(
        lang === 'am' ? 'ኮድ መቅዳት አልተቻለም. እባክዎ በእጅ ይቅዱ።' : 'Failed to copy. Please copy manually.',
        'error',
        3000
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="gov-card max-w-md w-full max-h-[90vh] my-auto flex flex-col">
        <div className="gov-header rounded-t-gov-xl p-4 md:p-6 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold font-amharic text-white">
            {lang === 'am' ? 'ቅሬታዎ ተመዝግቧል!' : 'Complaint Submitted!'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-white/70 flex-shrink-0 ml-2">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-white overflow-y-auto flex-1">
          {/* Success Icon */}
          <div className="flex justify-center flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
            </div>
          </div>

          {/* Ticket Number */}
          <div className="text-center flex-shrink-0">
            <p className="text-mayor-navy/70 text-xs md:text-sm font-amharic mb-1">
              {t('ticketNumber')}
            </p>
            <p className="text-xl md:text-2xl font-bold text-mayor-navy font-amharic break-all">
              {ticketNumber}
            </p>
          </div>

          {/* Unique Code - Prominent Display */}
          <div className="bg-mayor-royal-blue/10 p-4 md:p-6 rounded-gov border-2 border-mayor-royal-blue flex-shrink-0">
            <p className="text-mayor-navy font-semibold text-sm md:text-base font-amharic mb-3 md:mb-4 text-center">
              {lang === 'am' 
                ? 'የልዩ ኮድ (ለመከታተል ይጠቀሙ)' 
                : 'Unique Code (Use to Follow Up)'}
            </p>
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div 
                className="flex-1 bg-white p-3 md:p-4 rounded-gov border-2 border-mayor-royal-blue cursor-pointer hover:bg-mayor-royal-blue/5 transition-colors min-w-0"
                onClick={copyToClipboard}
                title={lang === 'am' ? 'ለመቅዳት ይጫኑ' : 'Click to copy'}
              >
                <p className="text-center text-xl md:text-3xl font-bold text-mayor-royal-blue font-mono tracking-widest select-all break-all">
                  {uniqueCode}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`p-3 md:p-4 rounded-gov transition-all flex-shrink-0 ${
                  copied 
                    ? 'bg-green-600 text-white scale-105' 
                    : 'bg-mayor-royal-blue text-white hover:bg-mayor-highlight-blue hover:scale-105'
                }`}
                title={lang === 'am' ? 'ኮድ ይቅዱ' : 'Copy code'}
              >
                {copied ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Copy className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-xs md:text-sm font-amharic text-center font-semibold">
                {lang === 'am' ? '✓ ኮድ ተቀድቷል!' : '✓ Code copied!'}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-3 md:p-4 rounded-gov border-l-4 border-yellow-400 flex-shrink-0">
            <p className="text-yellow-800 font-semibold text-xs md:text-sm font-amharic mb-2">
              {lang === 'am' ? '📋 መመሪያዎች:' : '📋 Instructions:'}
            </p>
            <ul className="text-yellow-800 text-xs md:text-sm font-amharic space-y-1 list-disc list-inside">
              <li>
                {lang === 'am' 
                  ? 'ይህንን ልዩ ኮድ ያስቀምጡ (ፎቶ ይውሰዱ ወይም ይጻፉ)'
                  : 'Save this unique code (take a photo or write it down)'}
              </li>
              <li>
                {lang === 'am' 
                  ? 'ቅሬታዎን ለመከታተል "ቅሬታ ለመከታተል" ቁልፍ ላይ ይጫኑ'
                  : 'To follow up, click "Follow Up Complaint" button'}
              </li>
              <li>
                {lang === 'am' 
                  ? 'የልዩ ኮድ ሳጥን ውስጥ ይህንን ኮድ ያስገቡ'
                  : 'Enter this code in the unique code box'}
              </li>
              <li>
                {lang === 'am' 
                  ? 'ኮዱን ለመቅዳት ከላይ ያለውን ቁልፍ ይጫኑ'
                  : 'Click the copy button above to copy the code'}
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full gov-button py-2 md:py-3 font-amharic text-sm md:text-base flex-shrink-0"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}

