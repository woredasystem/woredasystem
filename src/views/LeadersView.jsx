import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { officials } from '../data/officials'
import LeaderPageCard from '../components/LeaderPageCard'

export default function LeadersView({ onBack }) {
  const { t, lang } = useLanguage()

  // Get first 3 leaders for the main row
  const mainLeaders = officials.slice(0, 3)
  // Get remaining leaders for second row if needed
  const otherLeaders = officials.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mayor-royal-blue/5 to-white">
      <div className="p-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-8 gov-button px-4 py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </button>

          {/* Header Section */}
          <div className="gov-header rounded-gov-xl p-8 mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 font-amharic">
              {lang === 'am' ? 'አመራሮቻችን' : 'OUR LEADERS'}
            </h1>
            <div className="w-32 h-1.5 bg-white/40 mx-auto rounded-full mb-2"></div>
            <p className="text-white/90 text-lg font-amharic mt-4">
              {lang === 'am' 
                ? 'የወረዳ 9 አመራሮች እና አመራር ቡድን'
                : 'Woreda 9 Leadership Team'
              }
            </p>
          </div>

          {/* Main Leaders Row - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {mainLeaders.map((official) => (
              <LeaderPageCard key={official.id} official={official} />
            ))}
          </div>

          {/* Additional Leaders Row if more than 3 */}
          {otherLeaders.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-mayor-navy text-center font-amharic mb-4">
                  {lang === 'am' ? 'ተጨማሪ አመራሮች' : 'Additional Leaders'}
                </h2>
                <div className="w-24 h-1 bg-mayor-royal-blue mx-auto rounded-full"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {otherLeaders.map((official) => (
                  <LeaderPageCard key={official.id} official={official} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

