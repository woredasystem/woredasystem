import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { services } from '../data/services'
import SectorCard from '../components/SectorCard'

export default function ServicesView({ onBack, onNavigateToSector }) {
  const { t, lang } = useLanguage()

  const sectors = [
    { key: 'civilRegistration', ...services.civilRegistration },
    { key: 'tradeOffice', ...services.tradeOffice },
    { key: 'laborSkills', ...services.laborSkills },
    { key: 'chiefExecutiveOffice', ...services.chiefExecutiveOffice }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 gov-button px-4 py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </button>

          <div className="gov-header rounded-gov-lg p-6 mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2 font-amharic">
              {t('services')}
            </h1>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>

          {/* Sector Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <SectorCard
                key={sector.key}
                sector={sector}
                onClick={() => {
                  if (onNavigateToSector) {
                    onNavigateToSector(sector.key)
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

