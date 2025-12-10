import { FileText, Megaphone, Calendar, Users } from 'lucide-react'

const icons = {
  services: FileText,
  complaints: Megaphone,
  appointments: Calendar,
  leaders: Users
}

const colors = {
  services: 'from-mayor-royal-blue to-mayor-highlight-blue hover:from-mayor-highlight-blue hover:to-mayor-royal-blue',
  complaints: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
  appointments: 'from-mayor-highlight-blue to-mayor-royal-blue hover:from-mayor-royal-blue hover:to-mayor-deep-blue',
  leaders: 'from-mayor-deep-blue to-mayor-royal-blue hover:from-mayor-royal-blue hover:to-mayor-highlight-blue'
}

const glowColors = {
  services: 'hover:shadow-mayor-royal-blue/50',
  complaints: 'hover:shadow-red-600/50',
  appointments: 'hover:shadow-mayor-highlight-blue/50',
  leaders: 'hover:shadow-mayor-deep-blue/50'
}

export default function HeroButton({ type, onClick, label }) {
  const Icon = icons[type]
  const colorClass = colors[type]

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start justify-between p-5 h-auto min-h-[140px] w-full rounded-2xl transition-all duration-500 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md text-left shadow-lg hover:shadow-xl"
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${colorClass}`} />

      {/* Icon & Top Section */}
      <div className="relative z-10 w-full flex justify-between items-start">
        <div className={`p-3 rounded-xl bg-white/10 group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/20 group-hover:ring-white/40 shadow-inner`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Arrow Icon that appears on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Label & Bottom Section */}
      <div className="relative z-10 mt-4 w-full">
        <span className="block text-lg font-semibold text-white font-amharic tracking-wide leading-tight group-hover:translate-x-1 transition-transform duration-300">
          {label}
        </span>

        {/* Decorative Line */}
        <div className="mt-3 h-1 w-12 bg-white/20 rounded-full overflow-hidden group-hover:w-full transition-all duration-500 ease-out">
          <div className={`h-full w-full bg-gradient-to-r ${colorClass}`} />
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
    </button>
  )
}

