import { Languages, Shield } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import logo from '../assets/logo1.png'

export default function Header({ onPortalAccess }) {
  const { lang, toggleLanguage, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-mayor-royal-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src={logo} alt="Woreda 9 Logo" className="h-12 w-auto relative z-10 transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-mayor-navy font-amharic leading-tight">
                {lang === 'am' ? 'ወረዳ 9 አስተዳደር' : 'Woreda 9 Administration'}
              </h1>
              <p className="text-xs text-mayor-royal-blue font-medium tracking-wide">
                {lang === 'am' ? 'አቃቂ ቃሊቲ ክፍለ ከተማ' : 'Akaki Kality Sub-City'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Motto - Subtle & Hidden on Mobile */}
            <div className="hidden lg:block mr-6 border-r border-gray-200 pr-6">
              <p className="text-sm font-medium text-gray-500 font-amharic italic">
                {lang === 'am'
                  ? 'አልቆ ለመፈጸም ከህዝብ የተሰጠን አደራ!'
                  : 'Commitment to Public Trust'
                }
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onPortalAccess && (
                <button
                  onClick={onPortalAccess}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-mayor-navy hover:bg-mayor-deep-blue text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-mayor-navy/30 text-sm font-medium group"
                >
                  <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>{lang === 'am' ? 'የአስተዳደር ፓንል' : 'Admin Portal'}</span>
                </button>
              )}

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-mayor-navy rounded-full border border-gray-200 transition-all duration-300 hover:border-mayor-royal-blue/30"
              >
                <Languages className="w-4 h-4 text-mayor-royal-blue" />
                <span className="font-bold text-sm">{lang === 'am' ? 'EN' : 'አማ'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

