import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { login, getCurrentUser, logout } from '../utils/auth'
import { getDepartmentDisplayName } from '../utils/routing'
import { Shield, Lock, Building2 } from 'lucide-react'

export default function PortalLogin({ department, roleKey, onSuccess, onBack }) {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  
  // Get the Amharic department name for this portal (as default/suggestion)
  const defaultDepartmentAm = getDepartmentDisplayName(department, 'am')
  
  const [departmentName, setDepartmentName] = useState(defaultDepartmentAm || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // Wait a bit for Supabase to restore session
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const user = await getCurrentUser()
        if (user) {
          // User is already logged in, verify access and navigate
          if (user.portalUser.department === department || (user.portalUser.isAdmin && department === 'Admin')) {
            // Navigate directly to the portal page instead of calling onSuccess
            if (user.portalUser.isAdmin) {
              navigate('/portal/admin', { replace: true })
            } else {
              navigate(`/portal/department/${encodeURIComponent(user.portalUser.department)}/${user.portalUser.roleKey}`, { replace: true })
            }
          } else {
            // User is logged in but doesn't have access to this portal
            setError(lang === 'am' ? 'ይህንን ፓንል ለመዳረስ ፍቃድ የለዎትም' : 'You do not have access to this portal')
          }
        }
      } catch (err) {
        console.error('Error checking existing auth:', err)
      }
    }
    
    checkExistingAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, lang, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // If user is already logged in with a different account, sign them out first
      const existingUser = await getCurrentUser()
      if (existingUser && existingUser.portalUser.department !== department && !existingUser.portalUser.isAdmin) {
        await logout()
      }
      
      const result = await login(departmentName.trim(), password)
      
      if (result.success) {
        // Verify user has access to this department
        if (result.authData.portalUser.department !== department && !result.authData.portalUser.isAdmin) {
          setError(lang === 'am' ? 'ይህንን ፓንል ለመዳረስ ፍቃድ የለዎትም' : 'You do not have access to this portal')
          setLoading(false)
          return
        }
        
        // For admin, allow access to any portal
        if (result.authData.portalUser.isAdmin && department === 'Admin') {
          onSuccess(result.authData)
          return
        }
        
        // For department portals, verify department matches
        if (result.authData.portalUser.department === department) {
          onSuccess(result.authData)
        } else {
          setError(lang === 'am' ? 'ይህንን ፓንል ለመዳረስ ፍቃድ የለዎትም' : 'You do not have access to this portal')
          setLoading(false)
        }
      } else {
        setError(result.error || (lang === 'am' ? 'የተሳሳተ የመግቢያ መረጃ' : 'Invalid credentials'))
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || (lang === 'am' ? 'ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ' : 'An error occurred. Please try again'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mayor-deep-blue via-mayor-royal-blue to-mayor-highlight-blue flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="gov-card p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-mayor-royal-blue/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-mayor-royal-blue" />
            </div>
            <h1 className="text-2xl font-bold text-mayor-navy mb-2 font-amharic">
              {lang === 'am' ? 'የመግቢያ ፓንል' : 'Portal Login'}
            </h1>
            <p className="text-mayor-navy/70 font-amharic">
              {getDepartmentDisplayName(department, lang)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-mayor-navy mb-2 font-amharic font-semibold">
                {lang === 'am' ? 'የስራ ክፍል (አማርኛ)' : 'Department (Amharic)'}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mayor-navy/40" />
                <input
                  type="text"
                  required
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue font-amharic"
                  placeholder={lang === 'am' ? 'የስራ ክፍል በአማርኛ ያስገቡ (ምሳሌ: ንግድ ጽ/ቤት)' : 'Enter department in Amharic (e.g., ንግድ ጽ/ቤት)'}
                />
              </div>
              <p className="text-xs text-mayor-navy/60 mt-1 font-amharic">
                {lang === 'am' 
                  ? `ምክር: ${defaultDepartmentAm}` 
                  : `Suggested: ${defaultDepartmentAm}`
                }
              </p>
            </div>

            <div>
              <label className="block text-mayor-navy mb-2 font-amharic font-semibold">
                {lang === 'am' ? 'የይለፍ ቃል' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mayor-navy/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-gov bg-white border border-mayor-gray-divider text-mayor-navy focus:outline-none focus:ring-2 focus:ring-mayor-royal-blue focus:border-mayor-royal-blue"
                  placeholder={lang === 'am' ? 'የይለፍ ቃል ያስገቡ' : 'Enter password'}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-gov text-sm font-amharic">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 px-4 py-2 bg-white border border-mayor-gray-divider text-mayor-navy rounded-gov hover:bg-mayor-gray-divider transition-colors font-amharic"
                >
                  {t('back')}
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 gov-button py-2 disabled:opacity-50 font-amharic"
              >
                {loading 
                  ? (lang === 'am' ? 'በመግባት ላይ...' : 'Logging in...')
                  : (lang === 'am' ? 'ግባ' : 'Login')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

