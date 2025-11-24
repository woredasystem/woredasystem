import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'

export default function ServiceCard({ service }) {
  const [isOpen, setIsOpen] = useState(false)
  const { lang, t } = useLanguage()

  return (
    <div className="gov-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center hover:bg-mayor-royal-blue/5 transition-all border-b border-mayor-gray-divider"
      >
        <h3 className="text-xl font-bold text-mayor-navy font-amharic">
          {service.name[lang]}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-mayor-royal-blue" />
        ) : (
          <ChevronDown className="w-6 h-6 text-mayor-royal-blue" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4 pt-4">
          {service.items.map((item, index) => (
            <div key={index} className="bg-mayor-royal-blue/5 rounded-gov p-4 border-l-4 border-mayor-royal-blue">
              <h4 className="text-lg font-semibold text-mayor-navy mb-2 font-amharic">
                {item.name[lang]}
              </h4>
              <div className="text-mayor-navy/80 mb-2 font-amharic">
                <span className="font-semibold text-mayor-royal-blue">{t('requirements')}: </span>
                <span>{item.requirements[lang]}</span>
              </div>
              {item.standard && (
                <div className="text-mayor-navy/80 mb-2 font-amharic">
                  <span className="font-semibold text-mayor-royal-blue">{item.standard[lang]}</span>
                </div>
              )}
              {item.fee > 0 && (
                <div className="text-mayor-navy/80 font-amharic">
                  <span className="font-semibold text-mayor-royal-blue">{t('fee')}: </span>
                  <span>{item.fee} {t('etb')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

