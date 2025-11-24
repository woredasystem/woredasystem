import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { supabase } from '../lib/supabase'
import { services } from '../data/services'
import { X } from 'lucide-react'
import { showToast } from './ToastContainer'
import { 
  ethiopianMonths, 
  ethiopianMonthsEn, 
  getCurrentEthiopianDate, 
  ethiopianToGregorian,
  getDaysInEthiopianMonth 
} from '../utils/ethiopianCalendar'
import { getDepartmentFromService, getRoleKeyFromDepartment } from '../utils/routing'

export default function AppointmentForm({ onClose, onSuccess }) {
  const { t, lang } = useLanguage()
  const currentEthDate = getCurrentEthiopianDate()
  
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_phone: '',
    service_type: '',
    appointment_date: ''
  })
  const [ethiopianDate, setEthiopianDate] = useState({
    year: currentEthDate.year,
    month: currentEthDate.month,
    day: currentEthDate.day
  })
  const [appointmentTime, setAppointmentTime] = useState({
    hour: '03',
    minute: '00'
  })
  const [loading, setLoading] = useState(false)

  // Flatten all services for dropdown
  const allServices = [
    ...services.civilRegistration.items,
    ...services.tradeOffice.items,
    ...services.laborSkills.items
  ]

  // Get available days for selected month
  const maxDays = getDaysInEthiopianMonth(ethiopianDate.month, ethiopianDate.year)
  const daysArray = Array.from({ length: maxDays }, (_, i) => i + 1)

  // Generate hours (3-11) - Ethiopian time format
  // 3-7: ጠዋት (morning), 8-11: ከሰአት (afternoon/evening)
  const hoursArray = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 3
    return hour.toString().padStart(2, '0')
  })
  const minutesArray = ['00', '15', '30', '45']

  // Convert Ethiopian date and time to Gregorian datetime for database
  const convertToGregorianDateTime = () => {
    const gregorianDate = ethiopianToGregorian(
      ethiopianDate.year,
      ethiopianDate.month,
      ethiopianDate.day
    )
    
    // Get the date components to preserve the exact date
    const year = gregorianDate.getFullYear()
    const month = gregorianDate.getMonth() + 1 // getMonth() returns 0-11, we need 1-12
    const day = gregorianDate.getDate()
    const hour = parseInt(appointmentTime.hour)
    const minute = parseInt(appointmentTime.minute)
    
    // Store the Ethiopian hour directly in UTC
    // This way, when we read getUTCHours(), we get the Ethiopian hour directly
    // Create a UTC date with the Ethiopian hour (treating Ethiopian time as UTC for storage)
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0))
    
    return utcDate.toISOString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert Ethiopian date/time to Gregorian for database
      const gregorianDateTime = convertToGregorianDateTime()

      // Determine department and role key from service type
      const assignedDepartment = getDepartmentFromService(formData.service_type, lang)
      const assignedToRoleKey = getRoleKeyFromDepartment(assignedDepartment)

      // Generate unique code for follow-up (8 characters: 4 letters + 4 numbers)
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
      const numbers = '0123456789'
      let uniqueCode = ''
      for (let i = 0; i < 4; i++) {
        uniqueCode += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      for (let i = 0; i < 4; i++) {
        uniqueCode += numbers.charAt(Math.floor(Math.random() * numbers.length))
      }

      // Insert appointment
      const { error: insertError } = await supabase
        .from('appointments')
        .insert([{
          citizen_name: formData.citizen_name,
          citizen_phone: formData.citizen_phone,
          service_type: formData.service_type,
          appointment_date: gregorianDateTime,
          status: 'Confirmed',
          assigned_department: assignedDepartment,
          assigned_to_role_key: assignedToRoleKey,
          unique_code: uniqueCode
        }])

      if (insertError) throw insertError

      // Then fetch the inserted record using unique_code
      const { data, error: selectError } = await supabase
        .from('appointments')
        .select('*')
        .eq('unique_code', uniqueCode)
        .single()

      if (selectError) {
        console.error('Select error:', selectError)
        console.warn('Insert succeeded but could not fetch record:', selectError)
      }

      // Show impressive success toast with copy button
      const successMessage = lang === 'am' 
        ? `ቀጠሮዎ በተሳካ ሁኔታ ተመዝግቧል!\n\nየልዩ ኮድ: ${uniqueCode}\n\nእባክዎ ይህንን ኮድ ያስቀምጡ ለመከታተል!`
        : `Appointment booked successfully!\n\nUnique Code: ${uniqueCode}\n\nPlease save this code to follow up!`
      
      showToast(successMessage, 'success', 10000, true, uniqueCode)

      // Reset loading state
      setLoading(false)

      // Pass unique code to onSuccess callback for auto-fill
      onSuccess?.(uniqueCode)
      
      // Reset form
      setFormData({
        citizen_name: '',
        citizen_phone: '',
        service_type: '',
        appointment_date: ''
      })
      setEthiopianDate({
        year: currentEthDate.year,
        month: currentEthDate.month,
        day: currentEthDate.day
      })
      setAppointmentTime({
        hour: '03',
        minute: '00'
      })
      
      onClose()
    } catch (error) {
      console.error('Error booking appointment:', error)
      showToast(
        lang === 'am' ? 'ስህተት ተፈጥሯል። እባክዎ ይሞክሩ።' : 'An error occurred. Please try again.',
        'error',
        6000
      )
      setLoading(false)
    }
  }

  // Update day when month changes
  useEffect(() => {
    const maxDays = getDaysInEthiopianMonth(ethiopianDate.month, ethiopianDate.year)
    if (ethiopianDate.day > maxDays) {
      setEthiopianDate({ ...ethiopianDate, day: maxDays })
    }
  }, [ethiopianDate.month, ethiopianDate.year])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="gov-card max-w-2xl w-full">
        <div className="gov-header rounded-t-gov-xl p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-amharic">
            {t('bookAppointment')}
          </h2>
          <button onClick={onClose} className="text-white hover:text-white/70">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div>
            <label className="block text-mayor-navy mb-2 font-amharic font-semibold">
              {t('citizenName')} *
            </label>
            <input
              type="text"
              required
              value={formData.citizen_name}
              onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
              className="w-full px-4 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy placeholder-mayor-navy/40 focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
            />
          </div>

          <div>
            <label className="block text-mayor-navy mb-2 font-amharic font-semibold">
              {lang === 'am' ? 'የነዋሪ ስልክ' : 'Citizen Phone'} *
            </label>
            <input
              type="tel"
              required
              value={formData.citizen_phone}
              onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
              className="w-full px-4 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy placeholder-mayor-navy/40 focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
            />
          </div>

          <div>
            <label className="block text-mayor-navy mb-2 font-amharic font-semibold">
              {t('serviceType')} *
            </label>
            <select
              required
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="w-full px-4 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
            >
              <option value="">{lang === 'am' ? 'አገልግሎት ይምረጡ' : 'Select Service'}</option>
              {allServices.map((service, index) => (
                <option key={index} value={service.name[lang]}>
                  {service.name[lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-mayor-navy mb-3 font-amharic font-semibold">
              {t('appointmentDate')} * ({lang === 'am' ? 'የኢትዮጵያ ዘመን' : 'Ethiopian Calendar'})
            </label>
            
            {/* Ethiopian Date Selection */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Day */}
              <div>
                <label className="block text-sm text-mayor-navy/70 mb-1 font-amharic">
                  {lang === 'am' ? 'ቀን' : 'Day'}
                </label>
                <select
                  required
                  value={ethiopianDate.day}
                  onChange={(e) => setEthiopianDate({ ...ethiopianDate, day: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
                >
                  {daysArray.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-sm text-mayor-navy/70 mb-1 font-amharic">
                  {lang === 'am' ? 'ወር' : 'Month'}
                </label>
                <select
                  required
                  value={ethiopianDate.month}
                  onChange={(e) => setEthiopianDate({ ...ethiopianDate, month: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
                >
                  {(lang === 'am' ? ethiopianMonths : ethiopianMonthsEn).map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm text-mayor-navy/70 mb-1 font-amharic">
                  {lang === 'am' ? 'ዓመት' : 'Year'}
                </label>
                <input
                  type="number"
                  required
                  min={currentEthDate.year}
                  max={currentEthDate.year + 2}
                  value={ethiopianDate.year}
                  onChange={(e) => setEthiopianDate({ ...ethiopianDate, year: parseInt(e.target.value) || currentEthDate.year })}
                  className="w-full px-3 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hour */}
              <div>
                <label className="block text-sm text-mayor-navy/70 mb-1 font-amharic">
                  {lang === 'am' ? 'ሰዓት' : 'Hour'}
                </label>
                <select
                  required
                  value={appointmentTime.hour}
                  onChange={(e) => setAppointmentTime({ ...appointmentTime, hour: e.target.value })}
                  className="w-full px-3 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
                >
                  {hoursArray.map((hour) => {
                    const hourNum = parseInt(hour)
                    const period = hourNum >= 8 
                      ? (lang === 'am' ? 'ከሰአት' : 'PM') 
                      : (lang === 'am' ? 'ጠዋት' : 'AM')
                    return (
                      <option key={hour} value={hour}>
                        {hourNum} {period}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Minute */}
              <div>
                <label className="block text-sm text-mayor-navy/70 mb-1 font-amharic">
                  {lang === 'am' ? 'ደቂቃ' : 'Minute'}
                </label>
                <select
                  required
                  value={appointmentTime.minute}
                  onChange={(e) => setAppointmentTime({ ...appointmentTime, minute: e.target.value })}
                  className="w-full px-3 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
                >
                  {minutesArray.map((minute) => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 gov-button py-3 disabled:opacity-50"
            >
              {loading ? (lang === 'am' ? 'በመላክ ላይ...' : 'Booking...') : t('submit')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border border-mayor-gray-divider text-mayor-navy rounded-gov hover:bg-mayor-gray-divider transition-all"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

