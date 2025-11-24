import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import Header from './components/Header'
import HomeView from './views/HomeView'
import ServicesView from './views/ServicesView'
import SectorServicesView from './views/SectorServicesView'
import ComplaintsView from './views/ComplaintsView'
import AppointmentsView from './views/AppointmentsView'
import LeadersView from './views/LeadersView'
import PortalAccess from './views/PortalAccess'
import PortalLogin from './components/PortalLogin'
import DepartmentPortal from './views/DepartmentPortal'
import AdminPortal from './views/AdminPortal'
import ToastContainer from './components/ToastContainer'
import { getCurrentUser, logout, onAuthStateChange } from './utils/auth'
import { supabase } from './lib/supabase'
import { LanguageProvider } from './hooks/useLanguage'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [portalMode, setPortalMode] = useState('public') // 'public' or 'internal'
  const [selectedPortal, setSelectedPortal] = useState(null)
  const [auth, setAuth] = useState(null)
  const [authLoading, setAuthLoading] = useState(true) // Track auth loading state
  const authCheckInProgress = useRef(false) // Prevent multiple simultaneous auth checks
  const hasCheckedAuth = useRef(false) // Track if we've done initial auth check
  
  // Determine portal mode from path
  useEffect(() => {
    if (location.pathname.startsWith('/portal')) {
      setPortalMode('internal')
    } else {
      setPortalMode('public')
    }
  }, [location.pathname])

  // Listen to auth state changes - this handles session restoration
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuth(null)
        setAuthLoading(false)
        authCheckInProgress.current = false
        const currentPath = location.pathname
        if (currentPath.startsWith('/portal') && !currentPath.startsWith('/portal/login')) {
          navigate('/portal', { replace: true })
        }
      } else if (event === 'SIGNED_IN' && session) {
        try {
          // Use getCurrentUser which handles all the logic properly
          const user = await getCurrentUser()
          
          if (user) {
            setAuth(user)
            setAuthLoading(false)
            authCheckInProgress.current = false
            hasCheckedAuth.current = true
            
            // Navigate to appropriate portal if on /portal access page or login page
            const currentPath = location.pathname
            if (currentPath === '/portal' || currentPath === '/portal/' || currentPath.startsWith('/portal/login')) {
              const targetPath = user.portalUser.isAdmin 
                ? '/portal/admin'
                : `/portal/department/${encodeURIComponent(user.portalUser.department)}/${user.portalUser.roleKey}`
              navigate(targetPath, { replace: true })
            }
          } else {
            setAuth(null)
            setAuthLoading(false)
            authCheckInProgress.current = false
            hasCheckedAuth.current = true
          }
        } catch (error) {
          setAuth(null)
          setAuthLoading(false)
          authCheckInProgress.current = false
          hasCheckedAuth.current = true
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Refresh user data when token is refreshed
        const user = await getCurrentUser()
        if (user) {
          setAuth(user)
        }
      } else if (event === 'INITIAL_SESSION') {
        // This fires when Supabase restores the session from storage on page load/refresh
        authCheckInProgress.current = false
        
        if (session?.user) {
          // User has a session, fetch their data - but DON'T redirect, stay where they are
          // Query portal_users directly (faster than getCurrentUser)
          const { data: portalUser, error: portalUserError } = await supabase
            .from('portal_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          if (portalUser && !portalUserError) {
            const userData = {
              user: session.user,
              session: session,
              portalUser: {
                id: portalUser.id,
                email: portalUser.email,
                username: portalUser.username,
                fullName: portalUser.full_name,
                department: portalUser.department,
                roleKey: portalUser.role_key,
                isAdmin: portalUser.is_admin
              }
            }
            
            setAuth(userData)
            setAuthLoading(false)
            hasCheckedAuth.current = true
            
            // Only redirect if on login page or /portal access page
            // Otherwise, stay on current page (user is already where they should be)
            const currentPath = location.pathname
            if (currentPath.startsWith('/portal/login') || currentPath === '/portal' || currentPath === '/portal/') {
              const targetPath = userData.portalUser.isAdmin 
                ? '/portal/admin'
                : `/portal/department/${encodeURIComponent(userData.portalUser.department)}/${userData.portalUser.roleKey}`
              navigate(targetPath, { replace: true })
            }
          } else {
            setAuth(null)
            setAuthLoading(false)
            hasCheckedAuth.current = true
          }
        } else {
          setAuth(null)
          setAuthLoading(false)
          hasCheckedAuth.current = true
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

  // Check auth when portal mode changes - but only if INITIAL_SESSION hasn't handled it
  useEffect(() => {
    // Skip if we've already checked auth via INITIAL_SESSION
    if (hasCheckedAuth.current || authCheckInProgress.current) {
      return
    }

    const checkAuth = async () => {
      // Only check if in portal mode
      if (portalMode !== 'internal') {
        setAuthLoading(false)
        hasCheckedAuth.current = true
        return
      }

      authCheckInProgress.current = true
      setAuthLoading(true)
      
      // Set a timeout to ensure loading doesn't hang forever
      const timeoutId = setTimeout(() => {
        setAuthLoading(false)
        authCheckInProgress.current = false
        hasCheckedAuth.current = true
      }, 2000) // 2 second timeout
      
      try {
        // Wait a bit for Supabase to restore session from storage
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const currentPath = location.pathname
        
        // Check session directly first
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Query portal_users directly
          const { data: portalUser } = await supabase
            .from('portal_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          if (portalUser) {
            const user = {
              user: session.user,
              session: session,
              portalUser: {
                id: portalUser.id,
                email: portalUser.email,
                username: portalUser.username,
                fullName: portalUser.full_name,
                department: portalUser.department,
                roleKey: portalUser.role_key,
                isAdmin: portalUser.is_admin
              }
            }
            
            setAuth(user)
            setAuthLoading(false)
            hasCheckedAuth.current = true
            
            // Only redirect if on /portal access page, otherwise stay where you are
            if (currentPath === '/portal' || currentPath === '/portal/') {
              if (user.portalUser.isAdmin) {
                navigate('/portal/admin', { replace: true })
              } else {
                navigate(`/portal/department/${encodeURIComponent(user.portalUser.department)}/${user.portalUser.roleKey}`, { replace: true })
              }
            }
            // If already on a portal page, just stay there - don't redirect
          } else {
            setAuth(null)
            setAuthLoading(false)
            hasCheckedAuth.current = true
            // Only redirect if on a protected portal route
            const isProtectedRoute = currentPath !== '/portal' && 
              currentPath !== '/portal/' &&
              !currentPath.startsWith('/portal/login')
            if (isProtectedRoute) {
              navigate('/portal', { replace: true })
            }
          }
        } else {
          setAuth(null)
          setAuthLoading(false)
          hasCheckedAuth.current = true
          // Only redirect if on a protected portal route
          const isProtectedRoute = currentPath !== '/portal' && 
            currentPath !== '/portal/' &&
            !currentPath.startsWith('/portal/login')
          if (isProtectedRoute) {
            navigate('/portal', { replace: true })
          }
        }
      } catch (error) {
        setAuth(null)
        setAuthLoading(false)
        hasCheckedAuth.current = true
        const currentPath = location.pathname
        // Only redirect if on a protected portal route
        const isProtectedRoute = currentPath !== '/portal' && 
          currentPath !== '/portal/' &&
          !currentPath.startsWith('/portal/login')
        if (isProtectedRoute) {
          navigate('/portal', { replace: true })
        }
      } finally {
        clearTimeout(timeoutId)
        authCheckInProgress.current = false
      }
    }
    
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portalMode]) // Only depend on portalMode to avoid re-running on every navigation

  const handleLoginSuccess = async (authData) => {
    setAuth(authData)
    // Navigation is handled in PortalLoginWrapper
  }

  const handleBackToPublic = async () => {
    await logout()
    setAuth(null)
    setPortalMode('public')
    setSelectedPortal(null)
    navigate('/')
  }

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            {portalMode === 'public' && <Header onPortalAccess={() => navigate('/portal')} />}
            <HomeView onNavigate={(view) => {
              const routes = {
                'services': '/services',
                'complaints': '/complaints',
                'appointments': '/appointments',
                'leaders': '/leaders'
              }
              navigate(routes[view] || '/')
            }} />
          </>
        } />
        <Route path="/services" element={
          <>
            {portalMode === 'public' && <Header onPortalAccess={() => navigate('/portal')} />}
            <ServicesView 
              onBack={() => navigate('/')}
              onNavigateToSector={(sectorKey) => navigate(`/services/${sectorKey}`)}
            />
          </>
        } />
        <Route path="/services/:sectorKey" element={
          <>
            {portalMode === 'public' && <Header onPortalAccess={() => navigate('/portal')} />}
            <SectorServicesViewWrapper />
          </>
        } />
        <Route path="/complaints" element={
          <>
            {portalMode === 'public' && <Header onPortalAccess={() => navigate('/portal')} />}
            <ComplaintsView onBack={() => navigate('/')} />
          </>
        } />
        <Route path="/appointments" element={
          <>
            {portalMode === 'public' && <Header onPortalAccess={() => navigate('/portal')} />}
            <AppointmentsView onBack={() => navigate('/')} />
          </>
        } />
        <Route path="/leaders" element={
          <>
            {portalMode === 'public' && <Header onPortalAccess={() => navigate('/portal')} />}
            <LeadersView onBack={() => navigate('/')} />
          </>
        } />
        
        {/* Portal Routes */}
        <Route path="/portal" element={
          <PortalAccess onSelectPortal={(portal) => {
            if (portal.type === 'login') {
              navigate(`/portal/login/${portal.department}/${portal.roleKey}`)
            } else if (portal.type === 'admin') {
              navigate('/portal/admin')
            }
          }} />
        } />
        <Route path="/portal/login/:department/:roleKey" element={
          <PortalLoginWrapper onSuccess={handleLoginSuccess} />
        } />
        <Route path="/portal/admin" element={
          <ProtectedRoute 
            requiredAuth={true}
            requiredAdmin={true}
            auth={auth}
            authLoading={authLoading}
            onBack={handleBackToPublic}
          >
            <AdminPortal onBack={handleBackToPublic} />
          </ProtectedRoute>
        } />
        <Route path="/portal/department/:department/:roleKey" element={
          <ProtectedDepartmentRoute 
            auth={auth}
            authLoading={authLoading}
            onBack={handleBackToPublic}
          />
        } />
      </Routes>
    </div>
  )
}

// Wrapper component for SectorServicesView to get params
function SectorServicesViewWrapper() {
  const { sectorKey } = useParams()
  const navigate = useNavigate()
  return <SectorServicesView sectorKey={sectorKey} onBack={() => navigate('/services')} />
}

// Wrapper component for PortalLogin to get params
function PortalLoginWrapper({ onSuccess }) {
  const { department, roleKey } = useParams()
  const navigate = useNavigate()
  return (
    <PortalLogin
      department={decodeURIComponent(department)}
      roleKey={roleKey}
      onSuccess={async (authData) => {
        await onSuccess(authData)
        if (authData.portalUser.isAdmin) {
          navigate('/portal/admin')
        } else {
          navigate(`/portal/department/${encodeURIComponent(authData.portalUser.department)}/${authData.portalUser.roleKey}`)
        }
      }}
      onBack={() => navigate('/portal')}
    />
  )
}

// Protected Route Component
function ProtectedRoute({ children, requiredAuth, requiredAdmin, auth, onBack, authLoading }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return
    
    if (requiredAuth && !auth) {
      navigate('/portal', { replace: true })
    } else if (requiredAdmin && auth && !auth.portalUser.isAdmin) {
      navigate('/portal', { replace: true })
    }
  }, [auth, authLoading, requiredAuth, requiredAdmin, navigate, location.pathname])

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-mayor-navy font-amharic">Loading...</p>
      </div>
    )
  }

  if (requiredAuth && !auth) {
    return null
  }
  if (requiredAdmin && auth && !auth.portalUser.isAdmin) {
    return null
  }
  return children
}

// Protected Department Route Component
function ProtectedDepartmentRoute({ auth, onBack, authLoading }) {
  const { department, roleKey } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) {
      return
    }
    
    if (!auth) {
      navigate('/portal', { replace: true })
    } else if (auth.portalUser.roleKey !== roleKey) {
      // User is authenticated but wrong role, redirect to their portal
      if (auth.portalUser.isAdmin) {
        navigate('/portal/admin', { replace: true })
      } else {
        navigate(`/portal/department/${encodeURIComponent(auth.portalUser.department)}/${auth.portalUser.roleKey}`, { replace: true })
      }
    }
  }, [auth, authLoading, roleKey, navigate, location.pathname, department])

  // Show loading state while checking auth - but only briefly
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-mayor-navy font-amharic">Loading...</p>
      </div>
    )
  }

  if (!auth) {
    return null
  }
  
  if (auth.portalUser.roleKey !== roleKey) {
    return null
  }

  return (
    <DepartmentPortal
      department={decodeURIComponent(department)}
      roleKey={roleKey}
      onBack={onBack}
    />
  )
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
