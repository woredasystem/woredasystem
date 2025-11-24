import { useState } from 'react'
import { ArrowLeft, Plus, Search, Key, Download } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { supabase } from '../lib/supabase'
import ComplaintForm from '../components/ComplaintForm'
import ComplaintDetailModal from '../components/ComplaintDetailModal'
import { showToast } from '../components/ToastContainer'
import { gregorianToEthiopian, ethiopianMonths, ethiopianMonthsEn } from '../utils/ethiopianCalendar'
import { getDepartmentDisplayName } from '../utils/routing'
import { generateComplaintPDF } from '../utils/pdfGenerator'

export default function ComplaintsView({ onBack }) {
  const { t, lang } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [uniqueCode, setUniqueCode] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [expandedComplaints, setExpandedComplaints] = useState(new Set())
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailComplaint, setDetailComplaint] = useState(null)

  const searchByUniqueCode = async (e) => {
    e.preventDefault()
    if (!uniqueCode.trim()) {
      setComplaint(null)
      return
    }

    setSearchLoading(true)
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('unique_code', uniqueCode.trim().toUpperCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setComplaint(null)
        } else {
          throw error
        }
      } else {
        setComplaint(data)
      }
    } catch (error) {
      console.error('Error searching complaint:', error)
      showToast(
        t('errorOccurred'),
        'error',
        5000
      )
      setComplaint(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-600'
      case 'In Progress': return 'bg-mayor-royal-blue'
      case 'Escalated': return 'bg-red-600'
      default: return 'bg-yellow-500'
    }
  }

  const getStatusTranslation = (status) => {
    const statusMap = {
      'Pending': 'pending',
      'In Progress': 'inProgress',
      'Resolved': 'resolved',
      'Escalated': 'escalated'
    }
    return t(statusMap[status] || 'pending')
  }

  // Get status in Amharic for cards (force Amharic)
  const getStatusAmharic = (status) => {
    const statusMap = {
      'Pending': 'በመጠባበቅ ላይ',
      'In Progress': 'በሂደት ላይ',
      'Resolved': 'ተፈትቷል',
      'Escalated': 'ወደ ላይ ተላልፏል'
    }
    return statusMap[status] || 'በመጠባበቅ ላይ'
  }

  const formatDate = (dateString) => {
    const gregorianDate = new Date(dateString)
    const ethDate = gregorianToEthiopian(gregorianDate)
    
    // Get hour and minute from the date
    const hour = gregorianDate.getHours()
    const minute = gregorianDate.getMinutes()
    
    // Convert to Ethiopian time (6 hours behind)
    let ethHour = hour - 6
    if (ethHour < 0) ethHour += 24
    
    // Convert to 12-hour format
    let displayHour = ethHour
    let period = ''
    if (ethHour === 0) {
      displayHour = 12
      period = lang === 'am' ? 'ጠዋት' : 'AM'
    } else if (ethHour >= 1 && ethHour <= 5) {
      period = lang === 'am' ? 'ጠዋት' : 'AM'
    } else if (ethHour >= 6 && ethHour <= 11) {
      period = lang === 'am' ? 'ከሰአት' : 'AM'
    } else if (ethHour === 12) {
      period = lang === 'am' ? 'ከሰአት' : 'PM'
    } else if (ethHour >= 13 && ethHour <= 17) {
      displayHour = ethHour - 12
      period = lang === 'am' ? 'ከሰአት' : 'PM'
    } else {
      displayHour = ethHour - 12
      period = lang === 'am' ? 'ማታ' : 'PM'
    }
    
    const hourDisplay = displayHour.toString().padStart(2, '0')
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

            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 flex items-center gap-2 text-white font-medium rounded-gov shadow-gov transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-amharic">{t('fileComplaint')}</span>
            </button>
          </div>

          <div className="gov-header rounded-gov-lg p-6 mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 font-amharic">
              {t('complaints')}
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
                    {t('fileComplaint')}
                  </h3>
                  <p className="text-sm text-mayor-navy/70 font-amharic">
                    {t('fileNewComplaint')}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowFollowUp(true)
                setShowForm(false)
                setComplaint(null)
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
                    {t('followUpComplaint')}
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
                {t('enterUniqueCodePrompt')}
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

              {/* Complaint Result */}
              {searchLoading && (
                <div className="text-center py-8">
                  <p className="text-mayor-navy font-amharic">{t('searching')}</p>
                </div>
              )}

              {!searchLoading && complaint && (
                <div className="mt-6 gov-card p-4 md:p-6 border-l-4 border-mayor-royal-blue">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-mayor-navy/60 text-xs md:text-sm mb-1 break-all">
                        የትኬት ቁጥር: <span className="font-semibold text-mayor-navy">{complaint.ticket_number}</span>
                      </p>
                      <p className="text-mayor-navy/60 text-xs md:text-sm mb-2 break-all">
                        {t('uniqueCode')}: <span className="font-semibold text-mayor-navy">{complaint.unique_code}</span>
                      </p>
                      <h3 className="text-lg md:text-xl font-bold text-mayor-navy font-amharic break-words">
                        {complaint.complainant_name}
                      </h3>
                      <p className="text-xs md:text-sm text-mayor-navy/60 font-amharic mt-1 break-all">
                        {t('phone')}: {complaint.complainant_phone}
                      </p>
                    </div>
                    <span className={`px-2 md:px-3 py-1 rounded-gov text-white text-xs md:text-sm whitespace-nowrap self-start sm:self-auto ${getStatusColor(complaint.status)}`}>
                      {getStatusAmharic(complaint.status)}
                    </span>
                  </div>
                  <p className="text-mayor-navy/80 mb-2 font-amharic text-sm md:text-base break-words">
                    <span className="font-semibold text-mayor-royal-blue">{t('complaintRecipient')}:</span> {complaint.target_official}
                  </p>
                  <p className="text-mayor-navy/80 mb-2 font-amharic text-sm md:text-base break-words">
                    <span className="font-semibold text-mayor-royal-blue">{t('department')}:</span> {complaint.assigned_department ? getDepartmentDisplayName(complaint.assigned_department, lang) : 'N/A'}
                  </p>
                  {complaint.escalation_level > 1 && (
                    <p className="text-mayor-navy/80 mb-2 font-amharic">
                      <span className="font-semibold text-red-600">{t('escalationLevel')}:</span> {complaint.escalation_level}
                    </p>
                  )}
                  <div className="mb-2">
                    <p className={`text-mayor-navy/90 font-amharic text-sm md:text-base break-words overflow-wrap-anywhere leading-relaxed ${!expandedComplaints.has(complaint.id) ? 'line-clamp-3' : ''}`}>
                      {complaint.details}
                    </p>
                    {complaint.details && complaint.details.length > 150 && (
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedComplaints)
                          if (newExpanded.has(complaint.id)) {
                            newExpanded.delete(complaint.id)
                          } else {
                            newExpanded.add(complaint.id)
                          }
                          setExpandedComplaints(newExpanded)
                        }}
                        className="text-mayor-royal-blue hover:text-mayor-highlight-blue font-semibold text-sm mt-1 font-amharic"
                      >
                        {expandedComplaints.has(complaint.id) 
                          ? t('seeLess')
                          : t('seeMore')
                        }
                      </button>
                    )}
                  </div>
                  <p className="text-mayor-navy/60 text-sm font-amharic mb-2">
                    {t('submittedDate')}: {formatDate(complaint.created_at)}
                  </p>
                  {complaint.resolution_note && (
                    <div className="mt-4 pt-4 border-t border-mayor-gray-divider bg-green-50 p-4 rounded-gov">
                      <p className="text-green-800 font-semibold mb-2 font-amharic">
                        {t('resolutionNote')}:
                      </p>
                      <p className="text-green-700 font-amharic text-sm md:text-base break-words overflow-wrap-anywhere leading-relaxed">{complaint.resolution_note}</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-mayor-gray-divider flex gap-2">
                    <button
                      onClick={() => {
                        setDetailComplaint(complaint)
                        setShowDetailModal(true)
                      }}
                      className="flex-1 px-4 py-2 bg-mayor-royal-blue text-white rounded-gov hover:bg-mayor-highlight-blue transition-colors text-sm font-amharic"
                    >
                      {t('viewDetails')}
                    </button>
                    <button
                      onClick={() => generateComplaintPDF(complaint, lang)}
                      className="flex-1 px-4 py-2 bg-mayor-deep-blue text-white rounded-gov hover:bg-mayor-navy transition-colors text-sm font-amharic flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'am' ? 'PDF' : 'PDF'}
                    </button>
                  </div>
                </div>
              )}

              {!searchLoading && !complaint && uniqueCode.trim() && (
                <div className="mt-6 gov-card p-4 md:p-6 bg-red-50 border border-red-200 text-center">
                  <p className="text-red-700 font-amharic text-sm md:text-base">
                    {t('complaintNotFound')}
                  </p>
                </div>
              )}
            </div>
          )}

        {/* Show form or follow-up based on state */}
        {!showForm && !showFollowUp && (
          <div className="gov-card p-12 text-center">
            <p className="text-mayor-navy/70 font-amharic mb-4">
              {lang === 'am' 
                ? 'አዲስ ቅሬታ ለመጥቀስ ወይም የእርስዎን ቅሬታ ለመከታተል ከላይ ያሉትን ቁልፎች ይጠቀሙ'
                : 'Use the buttons above to file a new complaint or follow up on your complaint'
              }
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <ComplaintForm
          onClose={() => {
            setShowForm(false)
            // Reset form state
            setComplaint(null)
            setUniqueCode('')
          }}
          onSuccess={async (uniqueCode) => {
            // After successful submission, close form and show follow-up section
            setShowForm(false)
            setShowFollowUp(true)
            // Auto-fill the unique code and search for the complaint
            if (uniqueCode) {
              setUniqueCode(uniqueCode)
              // Automatically search for the complaint
              setSearchLoading(true)
              try {
                const { data, error } = await supabase
                  .from('complaints')
                  .select('*')
                  .eq('unique_code', uniqueCode.trim().toUpperCase())
                  .single()

                if (error) {
                  if (error.code === 'PGRST116') {
                    setComplaint(null)
                  } else {
                    throw error
                  }
                } else {
                  setComplaint(data)
                }
              } catch (error) {
                console.error('Error searching complaint:', error)
                setComplaint(null)
              } finally {
                setSearchLoading(false)
              }
            }
          }}
        />
      )}

      {/* Complaint Detail Modal */}
      {showDetailModal && detailComplaint && (
        <ComplaintDetailModal
          complaint={detailComplaint}
          onClose={() => {
            setShowDetailModal(false)
            setDetailComplaint(null)
          }}
        />
      )}
      </div>
    </div>
  )
}

