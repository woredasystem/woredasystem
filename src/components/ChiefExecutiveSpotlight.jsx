import { useLanguage } from '../hooks/useLanguage'
import { Award, Target, Users, Zap, Crown } from 'lucide-react'
import { officials } from '../data/officials'

export default function ChiefExecutiveSpotlight() {
  const { t, lang } = useLanguage()
  
  // Get Chief Executive (CEO) from officials
  const chiefExecutive = officials.find(o => o.role_key === 'ceo')

  return (
    <div className="gov-card p-8 md:p-12 my-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Photo Card - Vertical Rectangle */}
        <div className="flex items-center justify-center">
          <div className="relative w-80 md:w-96 lg:w-[28rem] h-[32rem] md:h-[36rem] lg:h-[40rem] rounded-gov-xl overflow-hidden shadow-gov-md border-2 border-mayor-gray-divider bg-gradient-to-br from-mayor-deep-blue to-mayor-royal-blue flex items-center justify-center">
            {chiefExecutive?.image_url ? (
              <img 
                src={chiefExecutive.image_url} 
                alt={lang === 'am' ? chiefExecutive.full_name_am : chiefExecutive.full_name_en}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-7xl text-white font-bold">
                {chiefExecutive?.full_name_en?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CA'}
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
            <h2 className="text-4xl md:text-5xl font-bold text-mayor-navy mb-3 font-amharic">
              {lang === 'am' ? 'ጫልቱ አያና' : 'Ms. Chaltu Ayana'}
            </h2>
            <p className="text-xl text-mayor-royal-blue mb-6 font-amharic font-semibold">
              {t('chiefExecutive')}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-mayor-navy/90 leading-relaxed text-lg font-amharic">
              {lang === 'am' 
                ? 'የወረዳ 9 የዲጂታል ሽግግር ራይ - ሁሉንም ነዋሪዎች ወደ ዘመናዊ የአገልግሎት ስርዓት ለመሸጋገር እየሰራን ነን።'
                : 'Woreda 9 Digital Transformation Vision - We are working to transition all residents to a modern service system.'}
            </p>
            
            <p className="text-mayor-navy/80 leading-relaxed text-base font-amharic">
              {lang === 'am' 
                ? 'በዚህ የዲጂታል ፖርታል በኩል፣ ነዋሪዎቻችን አገልግሎቶችን በቀላሉ፣ በፍጥነት እና በብቃት ማግኘት ይችላሉ። የእኛ ዋና ዓላማ ሁሉም ዜጎች ለመጠቀም የሚችሉ አገልግሎቶችን ማቅረብ ነው።'
                : 'Through this digital portal, our residents can access services easily, quickly, and efficiently. Our main goal is to provide services that all citizens can use.'}
            </p>

            <p className="text-mayor-navy/80 leading-relaxed text-base font-amharic">
              {lang === 'am' 
                ? 'የእኛ ቡድን በየቀኑ ለእርስዎ የተሻለ አገልግሎት ለመስጠት እየተጋ ነው። ቅሬታዎችን በቅልጥፍና እንቀበላለን እና እንፈታለን። ቀጠሮዎችን በመስመር ላይ ማዘዝ ይችላሉ።'
                : 'Our team is working every day to provide you with better service. We receive and resolve complaints efficiently. You can book appointments online.'}
            </p>
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

