import { useState } from 'react'
import { ArrowLeft, Plus, Search, Key, Calendar } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { supabase } from '../lib/supabase'
import AppointmentForm from '../components/AppointmentForm'
import { showToast } from '../components/ToastContainer'
import { gregorianToEthiopian, ethiopianMonths, ethiopianMonthsEn, formatEthiopianDate } from '../utils/ethiopianCalendar'
import { getDepartmentDisplayName } from '../utils/routing'

export default function AppointmentsView({ onBack }) {
  const { t, lang } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [uniqueCode, setUniqueCode] = useState('')
  const [appointment, setAppointment] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)

  const searchByUniqueCode = async (e) => {
    e.preventDefault()
    if (!uniqueCode.trim()) {
      setAppointment(null)
      return
    }

    setSearchLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('unique_code', uniqueCode.trim().toUpperCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setAppointment(null)
        } else {
          throw error
        }
      } else {
        setAppointment(data)
      }
    } catch (error) {
      console.error('Error searching appointment:', error)
      showToast(
        t('errorOccurred'),
        'error',
        5000
      )
      setAppointment(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-600'
      case 'Confirmed': return 'bg-mayor-royal-blue'
      case 'Missed': return 'bg-red-600'
      default: return 'bg-yellow-500'
    }
  }

  const getStatusAmharic = (status) => {
    const statusMap = {
      'Confirmed': 'የተረጋገጠ',
      'Completed': 'ተጠናቋል',
      'Missed': 'ተቆርጧል'
    }
    return statusMap[status] || 'የተረጋገጠ'
  }

  const formatDate = (dateString) => {
    const gregorianDate = new Date(dateString)
    const ethDate = gregorianToEthiopian(gregorianDate)
    
    // Get hour and minute from UTC to avoid timezone conversion issues
    // Since we stored it as UTC, we need to read it as UTC
    const hour = gregorianDate.getUTCHours()
    const minute = gregorianDate.getUTCMinutes()
    
    // Ethiopian time format: 3-7 ጠዋት, 8-11 ከሰአት
    let hourDisplay = hour
    let period = ''
    if (hour >= 3 && hour <= 7) {
      period = lang === 'am' ? 'ጠዋት' : 'AM'
    } else if (hour >= 8 && hour <= 11) {
      period = lang === 'am' ? 'ከሰአት' : 'PM'
    } else {
      // For hours outside 3-11, convert to 12-hour format
      let hour12 = hour
      if (hour === 0) {
        hour12 = 12
        period = lang === 'am' ? 'ማታ' : 'AM'
      } else if (hour < 12) {
        hour12 = hour
        period = lang === 'am' ? 'ጠዋት' : 'AM'
      } else if (hour === 12) {
        hour12 = 12
        period = lang === 'am' ? 'ከሰአት' : 'PM'
      } else {
        hour12 = hour - 12
        period = lang === 'am' ? 'ከሰአት' : 'PM'
      }
      hourDisplay = hour12
    }
    
    hourDisplay = hourDisplay.toString().padStart(2, '0')
    const minuteDisplay = minute.toString().padStart(2, '0')
    
    // Format the date
    const monthName = lang === 'am' 
      ? ethiopianMonths[ethDate.month - 1]
      : ethiopianMonthsEn[ethDate.month - 1]
    
    if (lang === 'am') {
      return `${ethDate.day} ${monthName} ${ethDate.year} ${hourDisplay}:${minuteDisplay} ${period}`
    } else {
      return `${monthName} ${ethDate.day}, ${ethDate.year} ${hourDisplay}:${minuteDisplay} ${period}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="gov-button px-4 py-2 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('back')}</span>
            </button>
          </div>

          <div className="gov-header rounded-gov-lg p-6 mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 font-amharic">
              {t('appointments')}
            </h1>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => {
                setShowForm(true)
                setShowFollowUp(false)
              }}
              className="gov-card p-6 hover:shadow-gov-md transition-all text-left group border-2 border-mayor-royal-blue"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mayor-royal-blue/10 rounded-gov-lg group-hover:bg-mayor-royal-blue/20 transition-colors">
                  <Plus className="w-8 h-8 text-mayor-royal-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-mayor-navy font-amharic mb-1">
                    {t('bookAppointment')}
                  </h3>
                  <p className="text-sm text-mayor-navy/70 font-amharic">
                    {t('bookNewAppointment')}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowFollowUp(true)
                setShowForm(false)
                setAppointment(null)
                setUniqueCode('')
              }}
              className="gov-card p-6 hover:shadow-gov-md transition-all text-left group border-2 border-mayor-highlight-blue"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mayor-highlight-blue/10 rounded-gov-lg group-hover:bg-mayor-highlight-blue/20 transition-colors">
                  <Key className="w-8 h-8 text-mayor-highlight-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-mayor-navy font-amharic mb-1">
                    {t('followUpAppointment')}
                  </h3>
                  <p className="text-sm text-mayor-navy/70 font-amharic">
                    {t('followUpByCode')}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Follow-up Section */}
          {showFollowUp && (
            <div className="gov-card p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-bold text-mayor-navy mb-3 md:mb-4 font-amharic">
                {t('followUpByUniqueCode')}
              </h2>
              <p className="text-mayor-navy/70 mb-3 md:mb-4 font-amharic text-sm md:text-base">
                {t('enterUniqueCodePromptAppointment')}
              </p>
              
              <form onSubmit={searchByUniqueCode} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={uniqueCode}
                  onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                  placeholder={t('enterUniqueCodePlaceholder')}
                  maxLength={8}
                  className="flex-1 px-3 md:px-4 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy placeholder-mayor-navy/40 focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue font-amharic text-center text-lg md:text-2xl tracking-widest"
                />
                <button
                  type="submit"
                  disabled={searchLoading || !uniqueCode.trim()}
                  className="gov-button px-4 md:px-6 py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-amharic text-sm md:text-base">{t('search')}</span>
                </button>
              </form>

              {/* Appointment Result */}
              {searchLoading && (
                <div className="text-center py-8">
                  <p className="text-mayor-navy font-amharic">{t('searching')}</p>
                </div>
              )}

              {!searchLoading && appointment && (
                <div className="mt-6 space-y-4">
                  {/* Main Appointment Card */}
                  <div className="gov-card p-6 border-l-4 border-mayor-royal-blue">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-mayor-navy/60 text-sm mb-1 break-all">
                          {t('uniqueCode')}: <span className="font-semibold text-mayor-navy">{appointment.unique_code}</span>
                        </p>
                        <h3 className="text-xl font-bold text-mayor-navy font-amharic break-words">
                          {appointment.citizen_name}
                        </h3>
                        <p className="text-sm text-mayor-navy/60 font-amharic mt-1 break-all">
                          {t('phone')}: {appointment.citizen_phone}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-gov text-white text-sm whitespace-nowrap self-start sm:self-auto ${getStatusColor(appointment.status)}`}>
                        {getStatusAmharic(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-mayor-royal-blue font-amharic">{t('serviceType')}:</span>
                        <p className="text-mayor-navy/80 font-amharic break-words mt-1">{appointment.service_type}</p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-mayor-royal-blue font-amharic">{t('appointmentDate')}:</span>
                        <p className="text-mayor-navy/80 font-amharic mt-1">{formatDate(appointment.appointment_date)}</p>
                      </div>
                      
                      {appointment.assigned_department && (
                        <div>
                          <span className="font-semibold text-mayor-royal-blue font-amharic">{t('department')}:</span>
                          <p className="text-mayor-navy/80 font-amharic mt-1">{getDepartmentDisplayName(appointment.assigned_department, lang)}</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="font-semibold text-mayor-royal-blue font-amharic">{t('bookedDate')}:</span>
                        <p className="text-mayor-navy/60 font-amharic text-sm mt-1">{formatDate(appointment.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Simple Reschedule Card */}
                  {appointment.rescheduled_at && (
                    <div className="gov-card p-4 bg-yellow-50/50 border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-gov flex-shrink-0">
                          <Calendar className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-yellow-900 font-amharic mb-2">
                            {lang === 'am' ? 'ቀጠሮው እንደገና ተዘጋጅቷል' : 'Appointment Rescheduled'}
                          </p>
                          {appointment.original_appointment_date && (
                            <p className="text-yellow-800 text-sm font-amharic mb-1">
                              <span className="font-medium">{lang === 'am' ? 'ከ' : 'From'}:</span> {formatDate(appointment.original_appointment_date)}
                            </p>
                          )}
                          <p className="text-yellow-800 text-sm font-amharic mb-1">
                            <span className="font-medium">{lang === 'am' ? 'ወደ' : 'To'}:</span> {formatDate(appointment.appointment_date)}
                          </p>
                          {appointment.reschedule_note && (
                            <p className="text-yellow-700 text-sm font-amharic mt-2 pt-2 border-t border-yellow-200">
                              {appointment.reschedule_note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!searchLoading && !appointment && uniqueCode.trim() && (
                <div className="mt-6 text-center py-8">
                  <p className="text-mayor-navy/70 font-amharic">{t('appointmentNotFound')}</p>
                </div>
              )}
            </div>
          )}

          {/* Appointment Form */}
          {showForm && (
            <AppointmentForm
              onClose={() => {
                setShowForm(false)
              }}
              onSuccess={(uniqueCode) => {
                setShowForm(false)
                // Auto-fill unique code and show follow-up
                setUniqueCode(uniqueCode)
                setShowFollowUp(true)
                // Trigger search automatically
                setTimeout(() => {
                  const fakeEvent = { preventDefault: () => {} }
                  searchByUniqueCode(fakeEvent)
                }, 100)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

