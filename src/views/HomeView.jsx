import { useLanguage } from '../hooks/useLanguage'
import HeroButton from '../components/HeroButton'
import AnalyticsBar from '../components/AnalyticsBar'
import ChiefExecutiveSpotlight from '../components/ChiefExecutiveSpotlight'
import LeadershipCarousel from '../components/LeadershipCarousel'
import logo from '../assets/logo1.png'
import heroBg from '../assets/hero-bg.jpg'

export default function HomeView({ onNavigate }) {
  const { t, lang } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-40 md:pt-32 pb-24 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            transform: 'scale(1.1)',
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Gradient Overlay - Multiple Layers for Depth */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-mayor-deep-blue/85 via-mayor-royal-blue/80 to-mayor-highlight-blue/75" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-mayor-navy/60 via-transparent to-transparent" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 z-[1] opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 20px
            )`
          }} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Hero Content - Split Layout */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Welcome Content */}
            <div className="text-left">
              {/* Logo */}
              <div className="mb-8">
                <div className="bg-white p-4 rounded-gov-lg shadow-gov-md inline-block">
                  <img src={logo} alt="Woreda 9 Logo" className="h-24 w-auto" />
                </div>
              </div>
              
              {/* Welcome Message in Amharic */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-amharic leading-tight">
                {lang === 'am' ? 'እንኳን ደህና መጡ' : t('welcome')}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 font-amharic mb-4 font-medium">
                {lang === 'am' 
                  ? 'አቃቂ ቃሊቲ ክፍለ ከተማ ወረዳ 9 አስተዳደር'
                  : t('welcomeSubtitle')
                }
              </p>
              <p className="text-base text-white/90 font-amharic leading-relaxed">
                {lang === 'am' 
                  ? 'አገልግሎቶችን ይመልከቱ፣ ቅሬታ ያስገቡ፣ ቀጠሮ ይዘዙ እና አመራሮቻችንን ይገናኙ'
                  : 'Browse services, file complaints, book appointments, and meet our leaders'
                }
              </p>
            </div>

            {/* Right Side - Buttons Grid (2x2) */}
            <div className="grid grid-cols-2 gap-4">
              <HeroButton
                type="services"
                onClick={() => onNavigate('services')}
                label={t('services')}
              />
              <HeroButton
                type="complaints"
                onClick={() => onNavigate('complaints')}
                label={t('complaints')}
              />
              <HeroButton
                type="appointments"
                onClick={() => onNavigate('appointments')}
                label={t('appointments')}
              />
              <HeroButton
                type="leaders"
                onClick={() => onNavigate('leaders')}
                label={t('leaders')}
              />
            </div>
          </div>
        </div>

        {/* Creative Blue Brand Divider - Diagonal Cut */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L0 80L1440 0L1440 120Z" fill="white"/>
            <path d="M0 100L0 60L1440 0L1440 100Z" fill="#1565C0" fillOpacity="0.1"/>
          </svg>
        </div>
      </section>

      {/* Other Sections - Separated from Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Analytics Bar */}
          <AnalyticsBar />

          {/* Chief Executive Spotlight */}
          <ChiefExecutiveSpotlight />

          {/* Leadership Carousel */}
          <LeadershipCarousel />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mayor-navy text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-amharic font-semibold mb-1">
                {lang === 'am' ? 'አቃኪ ቃሊቲ ክፍለ ከተማ ወረዳ 9' : 'Akaki Kality Sub-City Woreda 9'}
              </p>
              <p className="text-sm text-white/80 font-amharic">
                {lang === 'am' ? 'ዲጂታል አገልግሎት ፖርታል' : 'Digital Service Portal'}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-white/70 font-amharic">
                {lang === 'am' 
                  ? `© ${new Date().getFullYear()} ወረዳ 9. ሁሉም መብቶች የተጠበቁ ናቸው።`
                  : `© ${new Date().getFullYear()} Woreda 9. All rights reserved.`
                }
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

