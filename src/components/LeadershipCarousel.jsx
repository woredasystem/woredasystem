import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { officials } from '../data/officials'
import LeaderCard from './LeaderCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function LeadershipCarousel() {
  const { t, lang } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const itemsPerView = 3
  const totalLeaders = officials.length

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalLeaders - itemsPerView : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, totalLeaders - itemsPerView)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const getVisibleOfficials = () => {
    // Show 3 at a time, but can scroll through all
    const endIndex = Math.min(currentIndex + itemsPerView, totalLeaders)
    return officials.slice(currentIndex, endIndex)
  }

  return (
    <div className="my-16 bg-gradient-to-br from-mayor-deep-blue via-mayor-royal-blue to-mayor-highlight-blue py-16 rounded-gov-xl">
      {/* Title Section with Blue Header */}
      <div className="mb-10 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 uppercase tracking-wide text-white">
          {lang === 'am' ? 'አመራሮቻችንን ይገናኙ' : 'MEET OUR LEADERS'}
        </h2>
        <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto px-8">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-gov shadow-gov-md border border-mayor-gray-divider hover:bg-mayor-royal-blue transition-all group"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-mayor-royal-blue group-hover:text-white transition-colors" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-gov shadow-gov-md border border-mayor-gray-divider hover:bg-mayor-royal-blue transition-all group"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-mayor-royal-blue group-hover:text-white transition-colors" />
        </button>

        {/* Cards Container */}
        <div className="flex justify-center items-center gap-6 overflow-hidden min-h-[500px]">
          {getVisibleOfficials().map((official, idx) => {
            const isActive = idx === 1 // Center card is active
            return (
              <LeaderCard 
                key={official.id} 
                official={official} 
                isActive={isActive}
              />
            )
          })}
        </div>

        {/* Navigation Dots - Show dots for all leaders */}
        <div className="flex justify-center gap-2 mt-8">
          {officials.map((official, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + itemsPerView
            return (
              <button
                key={official.id}
                onClick={() => {
                  // Center the selected leader
                  const newIndex = Math.max(0, Math.min(index - 1, totalLeaders - itemsPerView))
                  setCurrentIndex(newIndex)
                }}
                className={`h-3 rounded-full transition-all ${
                  isVisible
                    ? 'bg-mayor-royal-blue w-8'
                    : 'bg-mayor-gray-divider hover:bg-mayor-royal-blue/50 w-3'
                }`}
                aria-label={`Go to ${official.full_name_en}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

