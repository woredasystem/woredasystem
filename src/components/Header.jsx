import { Languages, Shield } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import logo from '../assets/logo1.png'

export default function Header({ onPortalAccess }) {
  const { lang, toggleLanguage, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-gov border-b border-mayor-gray-divider">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="Woreda 9 Logo" className="h-12 w-auto" />
          </div>
          
          {/* Center: Motto (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center items-center px-4">
            <div className="bg-gradient-to-br from-mayor-deep-blue via-mayor-royal-blue to-mayor-deep-blue rounded-full px-8 py-4">
              <p className="text-base lg:text-lg xl:text-xl font-bold text-white font-amharic italic leading-relaxed tracking-wide">
                {lang === 'am' 
                  ? 'አልቆ ለመፈጸም ከህዝብ የተሰጠን አደራ!'
                  : 'Our Commitment to Fulfill the Trust Given by the People!'
                }
              </p>
            </div>
          </div>
          
          {/* Right: Portal and Language Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {onPortalAccess && (
              <button
                onClick={onPortalAccess}
                className="px-4 py-2 bg-mayor-deep-blue hover:bg-mayor-navy text-white rounded-gov flex items-center gap-2 transition-colors text-sm font-amharic"
              >
                <Shield className="w-4 h-4" />
                <span>{lang === 'am' ? 'ፓንል' : 'Portal'}</span>
              </button>
            )}
            <button
              onClick={toggleLanguage}
              className="gov-button px-4 py-2 flex items-center gap-2"
            >
              <Languages className="w-5 h-5" />
              <span className="font-semibold">{lang === 'am' ? 'EN' : 'አማ'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile: Motto below main header */}
      <div className="md:hidden py-4 px-4">
        <div className="mx-auto max-w-md">
          <div className="bg-gradient-to-br from-mayor-deep-blue via-mayor-royal-blue to-mayor-deep-blue rounded-full px-6 py-3">
            <p className="text-sm font-bold text-white font-amharic italic text-center leading-relaxed">
              {lang === 'am' 
                ? 'አልቆ ለመፈጸም ከህዝብ የተሰጠን አደራ!'
                : 'Our Commitment to Fulfill the Trust Given by the People!'
              }
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

