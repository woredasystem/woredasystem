import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { Award, Target, Users, Zap, Crown, ChevronLeft, ChevronRight } from 'lucide-react'
import { officials } from '../data/officials'
import felekeImage from '../assets/ፈለቀ ደውዬ.jpg'

export default function ChiefExecutiveSpotlight() {
  const { t, lang } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Get Chief Executive (CEO) from officials
  const chiefExecutive = officials.find(o => o.role_key === 'ceo')

  // Define leaders with their speeches
  const leaders = [
    {
      id: 1,
      full_name_am: 'ወ/ሮ ጫልቱ አያና',
      full_name_en: 'Ms. Chaltu Ayana',
      title_am: 'ዋና ሥራ አስፈፃሚ',
      title_en: 'Chief Executive',
      image_url: chiefExecutive?.image_url,
      speech: {
        am: [
          'የወረዳ 9 የዲጂታል ሽግግር ራይ - ሁሉንም ነዋሪዎች ወደ ዘመናዊ የአገልግሎት ስርዓት ለመሸጋገር እየሰራን ነን።',
          'በዚህ የዲጂታል ፖርታል በኩል፣ ነዋሪዎቻችን አገልግሎቶችን በቀላሉ፣ በፍጥነት እና በብቃት ማግኘት ይችላሉ። የእኛ ዋና ዓላማ ሁሉም ዜጎች ለመጠቀም የሚችሉ አገልግሎቶችን ማቅረብ ነው።',
          'የእኛ ቡድን በየቀኑ ለእርስዎ የተሻለ አገልግሎት ለመስጠት እየተጋ ነው። ቅሬታዎችን በቅልጥፍና እንቀበላለን እና እንፈታለን። ቀጠሮዎችን በመስመር ላይ ማዘዝ ይችላሉ።'
        ],
        en: [
          'Woreda 9 Digital Transformation Vision - We are working to transition all residents to a modern service system.',
          'Through this digital portal, our residents can access services easily, quickly, and efficiently. Our main goal is to provide services that all citizens can use.',
          'Our team is working every day to provide you with better service. We receive and resolve complaints efficiently. You can book appointments online.'
        ]
      }
    },
    {
      id: 2,
      full_name_am: 'አቶ ፈለቀ ደውዬ',
      full_name_en: 'Ato Feleke Dewuye',
      title_am: 'ወረዳ 9 ብልፅግና ፖርቲ ቅ/ፅ/ቤት ሀላፊ',
      title_en: 'Head, Woreda 9 Prosperity Party Office',
      image_url: felekeImage,
      speech: {
        am: [
          'አገልግሎት አሰጣጥን ቀልጣፋ ግልፀኝነትና ለአገልግሎት ምቹ ሁኔታን በመፍጠር   ፖርቲያችን የህዝብ አገልጋይነትንና ሰው ተኮር ፖሊሲያችንን  በአገልግሎት አሰጣጣችን እናረጋግጣለን!!'
        ],
        en: [
          'By creating transparent service delivery and convenient conditions for service, our party will demonstrate its people-serving nature and people-centered policy through our service delivery!!'
        ]
      }
    }
  ]

  const currentLeader = leaders[currentIndex]

  const nextLeader = () => {
    setCurrentIndex((prev) => (prev + 1) % leaders.length)
  }

  const prevLeader = () => {
    setCurrentIndex((prev) => (prev - 1 + leaders.length) % leaders.length)
  }

  return (
    <div className="gov-card p-8 md:p-12 my-16 relative">
      {/* Carousel Navigation Buttons */}
      <button
        onClick={prevLeader}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-gov-md transition-all duration-300 hover:scale-110"
        aria-label={lang === 'am' ? 'ያለፈ' : 'Previous'}
      >
        <ChevronLeft className="w-6 h-6 text-mayor-royal-blue" />
      </button>
      <button
        onClick={nextLeader}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-gov-md transition-all duration-300 hover:scale-110"
        aria-label={lang === 'am' ? 'ቀጣይ' : 'Next'}
      >
        <ChevronRight className="w-6 h-6 text-mayor-royal-blue" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {leaders.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-mayor-royal-blue w-8' : 'bg-mayor-gray-divider'
            }`}
            aria-label={`${lang === 'am' ? 'መረጃ' : 'Slide'} ${index + 1}`}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Photo Card - Vertical Rectangle */}
        <div className="flex items-center justify-center">
          <div className="relative w-80 md:w-96 lg:w-[28rem] h-[32rem] md:h-[36rem] lg:h-[40rem] rounded-gov-xl overflow-hidden shadow-gov-md border-2 border-mayor-gray-divider bg-gradient-to-br from-mayor-deep-blue to-mayor-royal-blue flex items-center justify-center transition-all duration-500">
            {currentLeader?.image_url ? (
              <img 
                src={currentLeader.image_url} 
                alt={lang === 'am' ? currentLeader.full_name_am : currentLeader.full_name_en}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-7xl text-white font-bold">
                {currentLeader?.full_name_en?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CA'}
              </div>
            )}
            {/* Decorative Crown Icon */}
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-white/30" />
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="border-l-4 border-mayor-royal-blue pl-4">
            <h2 className="text-4xl md:text-5xl font-bold text-mayor-navy mb-3 font-amharic transition-all duration-500">
              {lang === 'am' ? currentLeader.full_name_am : currentLeader.full_name_en}
            </h2>
            <p className="text-xl text-mayor-royal-blue mb-6 font-amharic font-semibold">
              {lang === 'am' ? currentLeader.title_am : currentLeader.title_en}
            </p>
          </div>

          <div className="space-y-4">
            {currentLeader.speech[lang].map((paragraph, index) => (
              <p 
                key={index}
                className={`text-mayor-navy/90 leading-relaxed font-amharic transition-all duration-500 ${
                  index === 0 ? 'text-lg' : 'text-base'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-mayor-gray-divider">
            <div className="flex items-center gap-3">
              <div className="bg-mayor-royal-blue p-3 rounded-gov shadow-gov">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-mayor-navy font-semibold font-amharic text-sm">
                  {lang === 'am' ? 'ፈጣን አገልግሎት' : 'Fast Service'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-mayor-highlight-blue p-3 rounded-gov shadow-gov">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-mayor-navy font-semibold font-amharic text-sm">
                  {lang === 'am' ? 'የህዝብ ተሳትፎ' : 'Public Engagement'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-mayor-royal-blue p-3 rounded-gov shadow-gov">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-mayor-navy font-semibold font-amharic text-sm">
                  {lang === 'am' ? 'የተሻለ ውጤት' : 'Better Results'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-mayor-highlight-blue p-3 rounded-gov shadow-gov">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-mayor-navy font-semibold font-amharic text-sm">
                  {lang === 'am' ? 'ከፍተኛ ጥራት' : 'High Quality'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

