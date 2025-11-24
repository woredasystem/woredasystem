import { useLanguage } from '../hooks/useLanguage'
import { useState, useEffect } from 'react'
import { Users, Building2, Briefcase } from 'lucide-react'
import { services } from '../data/services'

export default function AnalyticsBar() {
  const { t } = useLanguage()
  const [counts, setCounts] = useState({
    population: 0,
    blocks: 0,
    services: 0
  })

  // Calculate total services count from all sectors
  const getTotalServicesCount = () => {
    let total = 0
    Object.values(services).forEach(sector => {
      if (sector.items && Array.isArray(sector.items)) {
        total += sector.items.length
      }
    })
    return total
  }

  useEffect(() => {
    // Animate counters
    const totalServices = getTotalServicesCount()
    const targets = {
      population: 45000,
      blocks: 12,
      services: totalServices
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setCounts({
        population: Math.floor(targets.population * progress),
        blocks: Math.floor(targets.blocks * progress),
        services: Math.floor(targets.services * progress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setCounts(targets)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: t('population'), value: counts.population.toLocaleString(), suffix: '+', icon: Users },
    { label: t('blocks'), value: counts.blocks, suffix: '', icon: Building2 },
    { label: t('servicesCount'), value: counts.services, suffix: '+', icon: Briefcase }
  ]

  return (
    <div className="gov-card p-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-mayor-royal-blue/10 p-3 rounded-gov-lg">
                  <Icon className="w-8 h-8 text-mayor-royal-blue" />
                </div>
              </div>
              <div className="text-4xl font-bold text-mayor-royal-blue mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-mayor-navy font-amharic text-sm font-medium">
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

