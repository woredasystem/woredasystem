import { X, Download } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { gregorianToEthiopian, ethiopianMonths, ethiopianMonthsEn } from '../utils/ethiopianCalendar'
import { getDepartmentDisplayName } from '../utils/routing'
import { generateComplaintPDF } from '../utils/pdfGenerator'

export default function ComplaintDetailModal({ complaint, onClose }) {
  const { t, lang } = useLanguage()

  if (!complaint) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const gregorianDate = new Date(dateString)
    const ethDate = gregorianToEthiopian(gregorianDate)
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
    const monthName = lang === 'am' 
      ? ethiopianMonths[ethDate.month - 1]
      : ethiopianMonthsEn[ethDate.month - 1]
    if (lang === 'am') {
      return `${ethDate.day} ${monthName} ${ethDate.year} ${hourDisplay}:${minuteDisplay} ${period}`
    } else {
      return `${monthName} ${ethDate.day}, ${ethDate.year} ${hourDisplay}:${minuteDisplay} ${period}`
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

  const getStatusAmharic = (status) => {
    const statusMap = {
      'Pending': 'በመጠባበቅ ላይ',
      'In Progress': 'በሂደት ላይ',
      'Resolved': 'ተፈትቷል',
      'Escalated': 'ወደ ላይ ተላልፏል'
    }
    return statusMap[status] || 'በመጠባበቅ ላይ'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="gov-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="gov-header rounded-t-gov-xl p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold font-amharic">
            {lang === 'am' ? 'የቅሬታ ዝርዝር መረጃ' : 'Complaint Details'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-white/70">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-mayor-royal-blue/5 rounded-gov border-l-4 border-mayor-royal-blue">
            <div>
              <p className="text-mayor-navy/60 text-sm font-amharic mb-1">
                {t('ticketNumber')}: <span className="font-semibold text-mayor-navy">{complaint.ticket_number}</span>
              </p>
              <p className="text-mayor-navy/60 text-sm font-amharic mb-1">
                {t('uniqueCode')}: <span className="font-semibold text-mayor-navy text-lg">{complaint.unique_code || 'N/A'}</span>
              </p>
              <p className="text-mayor-navy/60 text-sm font-amharic">
                {t('submittedDate')}: <span className="font-semibold text-mayor-navy">{formatDate(complaint.created_at)}</span>
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-gov text-white text-sm ${getStatusColor(complaint.status)}`}>
                {getStatusAmharic(complaint.status)}
              </span>
              {complaint.escalation_level > 1 && (
                <p className="text-red-600 text-sm font-amharic mt-2">
                  {t('escalationLevel')}: {complaint.escalation_level}
                </p>
              )}
            </div>
          </div>

          {/* Form 01: Complainant Information */}
          <div className="border-b-2 border-mayor-gray-divider pb-4">
            <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
              {lang === 'am' ? '1) የቅሬታው/አቤቱታ አቅራቢው መረጃ' : '1) Complainant Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('complainantFullName')}</p>
                <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_name || 'N/A'}</p>
              </div>
              {complaint.complainant_age && (
                <div>
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('complainantAge')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_age}</p>
                </div>
              )}
              {complaint.complainant_gender && (
                <div>
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('complainantGender')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">
                    {complaint.complainant_gender === 'male' ? t('genderMale') : t('genderFemale')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('phone')}</p>
                <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_phone || 'N/A'}</p>
              </div>
              {complaint.complainant_email && (
                <div>
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('email')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submission Type */}
          {complaint.submission_type && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {lang === 'am' ? '2) ቅሬታው/አቤቱታው የቀረበው' : '2) Submission Type'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('submissionType')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">
                    {complaint.submission_type === 'individual' ? t('submissionTypeIndividual') : t('submissionTypeGroup')}
                  </p>
                </div>
                {complaint.submission_type === 'group' && complaint.group_member_count && (
                  <div>
                    <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('groupMemberCount')}</p>
                    <p className="text-mayor-navy font-semibold font-amharic">{complaint.group_member_count}</p>
                  </div>
                )}
              </div>
              {complaint.submission_type === 'group' && complaint.group_members_info && (
                <div className="mt-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-2">{t('groupMembersInfo')}</p>
                  <div className="bg-yellow-50 p-4 rounded-gov border-l-4 border-yellow-400">
                    <p className="text-mayor-navy font-amharic whitespace-pre-wrap">{complaint.group_members_info}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Address */}
          {(complaint.complainant_subcity || complaint.complainant_woreda || complaint.complainant_house_number) && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {lang === 'am' ? '3) አድራሻ' : '3) Address'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complaint.complainant_subcity && (
                  <div>
                    <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('subcity')}</p>
                    <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_subcity}</p>
                  </div>
                )}
                {complaint.complainant_woreda && (
                  <div>
                    <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('woreda')}</p>
                    <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_woreda}</p>
                  </div>
                )}
                {complaint.complainant_house_number && (
                  <div>
                    <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('houseNumber')}</p>
                    <p className="text-mayor-navy font-semibold font-amharic">{complaint.complainant_house_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Institution */}
          {complaint.submission_institution && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {lang === 'am' ? '4) ቅሬታ/አቤቱታ የቀረበበት ተቋም' : '4) Submission Institution'}
              </h3>
              <p className="text-mayor-navy font-semibold font-amharic">{complaint.submission_institution}</p>
            </div>
          )}

          {/* Previous Written Response */}
          {complaint.previous_written_response && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {lang === 'am' ? '5) የፅሁፍ ምላሽ' : '5) Previous Written Response'}
              </h3>
              <p className="text-mayor-navy font-amharic whitespace-pre-wrap">{complaint.previous_written_response}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="border-b-2 border-mayor-gray-divider pb-4">
            <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
              {lang === 'am' ? '6) የቅሬታው/የአቤቱታው ዋና ጭብጥ' : '6) Main Content of Complaint/Appeal'}
            </h3>
            <p className="text-mayor-navy font-amharic whitespace-pre-wrap">
              {complaint.complaint_main_content || complaint.details || 'N/A'}
            </p>
          </div>

          {/* Requested Solution */}
          {complaint.requested_solution && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {lang === 'am' ? '7) የሚፈልገው መፍትሄ' : '7) Requested Solution'}
              </h3>
              <p className="text-mayor-navy font-amharic whitespace-pre-wrap">{complaint.requested_solution}</p>
            </div>
          )}

          {/* Target Official */}
          <div className="border-b-2 border-mayor-gray-divider pb-4">
            <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
              {t('targetOfficial')}
            </h3>
            <p className="text-mayor-navy font-semibold font-amharic">{complaint.target_official || 'N/A'}</p>
            {complaint.assigned_department && (
              <p className="text-mayor-navy/70 text-sm font-amharic mt-2">
                {t('department')}: {getDepartmentDisplayName(complaint.assigned_department, lang)}
              </p>
            )}
          </div>

          {/* Form 02: Response Information (if exists) */}
          {(complaint.appeal_content || complaint.properly_investigated !== null || complaint.investigation_findings || complaint.summary_response) && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {t('form02Title')}
              </h3>
              
              {complaint.complaint_submission_date && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('complaintSubmissionDate')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">{formatDate(complaint.complaint_submission_date)}</p>
                </div>
              )}

              {complaint.appeal_content && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('appealContent')}</p>
                  <p className="text-mayor-navy font-amharic whitespace-pre-wrap">{complaint.appeal_content}</p>
                </div>
              )}

              {complaint.properly_investigated !== null && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('investigationStatus')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">
                    {complaint.properly_investigated ? t('properlyInvestigated') : t('notProperlyInvestigated')}
                  </p>
                  {!complaint.properly_investigated && complaint.investigation_failure_reason && (
                    <p className="text-mayor-navy/80 text-sm font-amharic mt-2">{complaint.investigation_failure_reason}</p>
                  )}
                </div>
              )}

              {complaint.investigation_findings && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('investigationFindings')}</p>
                  <p className="text-mayor-navy font-amharic whitespace-pre-wrap">{complaint.investigation_findings}</p>
                </div>
              )}

              {complaint.summary_response && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('summaryResponse')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">
                    {complaint.summary_response === 'correct' ? t('complaintCorrect') : t('complaintIncorrect')}
                  </p>
                </div>
              )}

              {complaint.action_to_be_taken && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('actionToBeTaken')}</p>
                  <p className="text-mayor-navy font-amharic whitespace-pre-wrap">{complaint.action_to_be_taken}</p>
                </div>
              )}

              {complaint.investigated_by_expert && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('investigatedByExpert')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">{complaint.investigated_by_expert}</p>
                  {complaint.expert_investigation_date && (
                    <p className="text-mayor-navy/70 text-sm font-amharic mt-1">
                      {t('expertInvestigationDate')}: {formatDate(complaint.expert_investigation_date)}
                    </p>
                  )}
                </div>
              )}

              {complaint.final_decision_by && (
                <div className="mb-4">
                  <p className="text-mayor-navy/70 text-sm font-amharic mb-1">{t('finalDecisionBy')}</p>
                  <p className="text-mayor-navy font-semibold font-amharic">{complaint.final_decision_by}</p>
                  {complaint.final_decision_date && (
                    <p className="text-mayor-navy/70 text-sm font-amharic mt-1">
                      {t('finalDecisionDate')}: {formatDate(complaint.final_decision_date)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resolution Note */}
          {complaint.resolution_note && (
            <div className="border-b-2 border-mayor-gray-divider pb-4">
              <h3 className="text-lg font-bold text-mayor-navy mb-4 font-amharic">
                {t('resolutionNote')}
              </h3>
              <div className="bg-green-50 p-4 rounded-gov">
                <p className="text-green-700 font-amharic whitespace-pre-wrap">{complaint.resolution_note}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => generateComplaintPDF(complaint, lang)}
              className="flex-1 px-4 py-3 bg-mayor-deep-blue text-white rounded-gov hover:bg-mayor-navy transition-colors font-amharic flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {lang === 'am' ? 'PDF ያውርዱ' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border border-mayor-gray-divider text-mayor-navy rounded-gov hover:bg-mayor-gray-divider transition-all font-amharic"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

