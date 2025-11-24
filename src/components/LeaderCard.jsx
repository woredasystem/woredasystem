import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import ImageModal from './ImageModal'

export default function LeaderCard({ official, isActive = false }) {
  const { lang } = useLanguage()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className={`flex-shrink-0 w-64 transition-all duration-300 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-75'}`}>
        <div className={`gov-card overflow-hidden ${isActive ? 'border-mayor-royal-blue border-2' : 'border-mayor-gray-divider'}`}>
        {/* Photo Area with Creative 4-Corner Design */}
        <div className="h-80 bg-gradient-to-br from-mayor-deep-blue/5 to-mayor-royal-blue/5 flex items-center justify-center relative p-6">
          {/* Decorative corner brackets */}
          <div className="absolute top-6 left-6 w-16 h-16">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-mayor-royal-blue rounded-tl-lg"></div>
          </div>
          <div className="absolute top-6 right-6 w-16 h-16">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-mayor-royal-blue rounded-tr-lg"></div>
          </div>
          <div className="absolute bottom-6 left-6 w-16 h-16">
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-mayor-royal-blue rounded-bl-lg"></div>
          </div>
          <div className="absolute bottom-6 right-6 w-16 h-16">
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-mayor-royal-blue rounded-br-lg"></div>
          </div>
          
          {/* Image Container with Creative 4-Corner Design */}
          <div className="relative w-52 h-64">
            {/* Main image container with beveled corners - Clickable */}
            <div 
              className={`w-full h-full relative overflow-hidden shadow-gov-md ${official.image_url ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
              style={{
                clipPath: 'polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)',
                backgroundColor: official.image_url ? 'transparent' : '#1565C0'
              }}
              onClick={() => official.image_url && setShowModal(true)}
            >
              {official.image_url ? (
                <img 
                  src={official.image_url} 
                  alt={official.full_name_en} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-mayor-deep-blue to-mayor-royal-blue">
                  <div className="text-4xl text-white font-bold">
                    {official.full_name_en.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              )}
            </div>
            
            {/* Decorative border frame */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: 'polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)',
                boxShadow: isActive 
                  ? 'inset 0 0 0 3px #1565C0' 
                  : 'inset 0 0 0 2px #E3E3E3'
              }}
            ></div>
          </div>
        </div>
        
        {/* Name & Title Label */}
        <div className="bg-white px-4 py-5 text-center border-t border-mayor-gray-divider">
          <h3 className="text-lg font-bold text-mayor-navy mb-1 font-amharic">
            {lang === 'am' ? official.full_name_am : official.full_name_en}
          </h3>
          <p className="text-sm text-mayor-royal-blue font-amharic font-semibold">
            {lang === 'am' ? official.title_am : official.title_en}
          </p>
        </div>
      </div>
      </div>
      
      {/* Image Modal */}
      {showModal && (
        <ImageModal
          imageUrl={official.image_url}
          alt={lang === 'am' ? official.full_name_am : official.full_name_en}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

