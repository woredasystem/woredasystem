import { FileText, Megaphone, Calendar, Users } from 'lucide-react'

const icons = {
  services: FileText,
  complaints: Megaphone,
  appointments: Calendar,
  leaders: Users
}

const colors = {
  services: 'bg-mayor-royal-blue hover:bg-mayor-highlight-blue',
  complaints: 'bg-red-600 hover:bg-red-700',
  appointments: 'bg-mayor-highlight-blue hover:bg-mayor-royal-blue',
  leaders: 'bg-mayor-deep-blue hover:bg-mayor-royal-blue'
}

export default function HeroButton({ type, onClick, label }) {
  const Icon = icons[type]
  const colorClass = colors[type]

  return (
    <button
      onClick={onClick}
      className={`${colorClass} p-6 w-full h-32 flex flex-col items-center justify-center gap-3 text-white rounded-gov-xl shadow-gov-md transition-all duration-200 hover:shadow-lg`}
    >
      <Icon className="w-10 h-10" />
      <span className="text-lg font-semibold font-amharic">
        {label}
      </span>
    </button>
  )
}

