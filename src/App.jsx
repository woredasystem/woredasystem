import { useState, useEffect } from 'react'
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
import { LanguageProvider } from './hooks/useLanguage'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [portalMode, setPortalMode] = useState('public') // 'public' or 'internal'
  const [selectedPortal, setSelectedPortal] = useState(null)
  const [auth, setAuth] = useState(null)
  
  // Determine portal mode from path
  useEffect(() => {
    if (location.pathname.startsWith('/portal')) {
      setPortalMode('internal')
    } else {
      setPortalMode('public')
    }
  }, [location.pathname])

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (user && portalMode === 'internal') {
        setAuth(user)
        // Restore portal access
        if (user.portalUser.isAdmin) {
          setSelectedPortal({ type: 'admin' })
        } else {
          setSelectedPortal({ 
            type: 'department', 
            department: user.portalUser.department,
            roleKey: user.portalUser.roleKey 
          })
        }
      }
    }
    
    checkAuth()

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuth(null)
        if (portalMode === 'internal') {
          setPortalMode('public')
          setSelectedPortal(null)
        }
      } else if (event === 'SIGNED_IN' && session) {
        const user = await getCurrentUser()
        if (user) {
          setAuth(user)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [portalMode])

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
            onBack={handleBackToPublic}
          >
            <AdminPortal onBack={handleBackToPublic} />
          </ProtectedRoute>
        } />
        <Route path="/portal/department/:department/:roleKey" element={
          <ProtectedDepartmentRoute 
            auth={auth}
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
function ProtectedRoute({ children, requiredAuth, requiredAdmin, auth, onBack }) {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (requiredAuth && !auth) {
      navigate('/portal')
    } else if (requiredAdmin && auth && !auth.portalUser.isAdmin) {
      navigate('/portal')
    }
  }, [auth, requiredAuth, requiredAdmin, navigate])

  if (requiredAuth && !auth) {
    return null
  }
  if (requiredAdmin && auth && !auth.portalUser.isAdmin) {
    return null
  }
  return children
}

// Protected Department Route Component
function ProtectedDepartmentRoute({ auth, onBack }) {
  const { department, roleKey } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth) {
      navigate('/portal')
    } else if (auth.portalUser.roleKey !== roleKey) {
      navigate('/portal')
    }
  }, [auth, roleKey, navigate])

  if (!auth || auth.portalUser.roleKey !== roleKey) {
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
