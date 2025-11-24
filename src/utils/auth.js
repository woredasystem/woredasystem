// Supabase Authentication utility for internal portals
import { supabase } from '../lib/supabase'

// Map Amharic department name directly to email (frontend mapping - no DB query needed)
const departmentToEmailMap = {
  'ንግድ ጽ/ቤት': 'trade@woreda9.gov.et',
  'ሲቪል ምዝገባ': 'civil@woreda9.gov.et',
  'ስራና ክህሎት': 'labor@woreda9.gov.et',
  'ዋና ሥራ አስፈፃሚ ጽ/ቤት': 'ceo@woreda9.gov.et',
  'ዋና ሥራ አስፈፃሚ': 'chief.executive@woreda9.gov.et',
  'ወረዳ ምክር ቤት': 'council.speaker@woreda9.gov.et',
  'አስተዳደር': 'admin@woreda9.gov.et'
}

// Map Amharic department name to English department name
function getDepartmentFromAmharic(deptAm) {
  const mapping = {
    'ንግድ ጽ/ቤት': 'Trade Office',
    'ሲቪል ምዝገባ': 'Civil Registration',
    'ስራና ክህሎት': 'Labor & Skills',
    'ዋና ሥራ አስፈፃሚ ጽ/ቤት': 'Chief Executive Office',
    'ዋና ሥራ አስፈፃሚ': 'Chief Executive',
    'ወረዳ ምክር ቤት': 'Woreda Council',
    'አስተዳደር': 'Admin'
  }
  return mapping[deptAm] || null
}

export async function login(departmentNameOrEmail, password) {
  try {
    // Determine if input is Amharic department name or email
    let email = null
    let targetDepartment = null
    
    // Check if it's an Amharic department name - use frontend mapping (no DB query)
    if (departmentToEmailMap[departmentNameOrEmail]) {
      // It's an Amharic department name - get email from frontend mapping
      email = departmentToEmailMap[departmentNameOrEmail]
      targetDepartment = getDepartmentFromAmharic(departmentNameOrEmail)
    } else {
      // Assume it's an email
      email = departmentNameOrEmail
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      // Provide more helpful error messages
      let errorMessage = authError.message
      
      if (authError.message.includes('Invalid login credentials') || authError.message.includes('Email not confirmed')) {
        // Check if user exists but credentials are wrong
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (authError.message.includes('User not found') || authError.message.includes('Invalid login')) {
        errorMessage = 'User account not found. Please contact administrator to create your account.'
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Email not confirmed. Please contact administrator.'
      }
      
      console.error('Auth error:', { email, error: authError.message, code: authError.status })
      return { success: false, error: errorMessage }
    }

    if (!authData.user || !authData.session) {
      return { success: false, error: 'Authentication failed - no user or session' }
    }

    // The session from signInWithPassword is already active in the client
    // No need to call setSession again - it's already set by signInWithPassword
    
    // Now that we're authenticated, RLS policies allow us to query
    let portalUser = null
    
    // Try by user_id first (preferred method) - this should work with the active session
    const { data: userById, error: errorById } = await supabase
      .from('portal_users')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()
    
    if (userById && !errorById) {
      portalUser = userById
    } else {
      console.log('User lookup by user_id failed, trying email:', { 
        errorById: errorById?.message || errorById, 
        userId: authData.user.id 
      })
      
      // Fallback to email lookup (for initial setup)
      const { data: userByEmail, error: errorByEmail } = await supabase
        .from('portal_users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (userByEmail && !errorByEmail) {
        portalUser = userByEmail
        // Link the user_id if not already linked
        if (!portalUser.user_id) {
          const { error: updateError } = await supabase
            .from('portal_users')
            .update({ user_id: authData.user.id })
            .eq('id', portalUser.id)
          
          if (updateError) {
            console.error('Failed to link user_id:', updateError)
          }
        }
      } else {
        console.error('Portal user lookup errors:', { 
          errorById: errorById?.message || errorById, 
          errorByEmail: errorByEmail?.message || errorByEmail,
          email,
          userId: authData.user.id
        })
        // If user doesn't exist in portal_users, sign out
        await supabase.auth.signOut()
        return { 
          success: false, 
          error: errorByEmail?.message || errorById?.message || 'User not authorized for portal access' 
        }
      }
    }

    if (!portalUser) {
      await supabase.auth.signOut()
      return { success: false, error: 'User not authorized for portal access' }
    }

    // If login was by department name, verify it matches
    // Note: Allow slight variations (e.g., "Chief Executive" vs "Chief Executive Office")
    if (targetDepartment && portalUser.department !== targetDepartment) {
      // Log for debugging
      console.warn('Department mismatch:', {
        targetDepartment,
        portalUserDepartment: portalUser.department,
        email: portalUser.email
      })
      
      // For now, allow login but log the mismatch
      // The PortalLogin component will verify access to the specific portal
      // This check is too strict and causes issues with department name variations
    }

    return {
      success: true,
      authData: {
        user: authData.user,
        session: authData.session,
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
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

export async function logout() {
  await supabase.auth.signOut()
}

// Track if getCurrentUser is already running to prevent concurrent calls
let getCurrentUserPromise = null

export async function getCurrentUser() {
  try {
    // If already running, return the existing promise
    if (getCurrentUserPromise) {
      console.log('getCurrentUser: Already running, reusing promise')
      return await getCurrentUserPromise
    }
    
    console.log('getCurrentUser: Starting...')
    
    // Create the promise and store it
    getCurrentUserPromise = (async () => {
      try {
        // First check if there's an active session
        console.log('getCurrentUser: Calling getSession...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('getCurrentUser: Session check:', { hasSession: !!session, error: sessionError?.message })
        
        if (sessionError) {
          console.error('getCurrentUser: Session error:', sessionError)
          return null
        }
        
        if (!session) {
          console.log('getCurrentUser: No session found')
          return null
        }

        // Get the user from the session
        console.log('getCurrentUser: Calling getUser...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('getCurrentUser: User check:', { hasUser: !!user, userId: user?.id, error: userError?.message })
        
        if (userError) {
          console.error('getCurrentUser: User error:', userError)
          return null
        }
        
        if (!user) {
          console.log('getCurrentUser: No user found')
          return null
        }

        // Get portal user details using user_id
        console.log('getCurrentUser: Fetching portal user for user_id:', user.id)
        const { data: portalUser, error: portalUserError } = await supabase
          .from('portal_users')
          .select('*')
          .eq('user_id', user.id)
          .single()

        console.log('getCurrentUser: Portal user query:', { hasPortalUser: !!portalUser, error: portalUserError?.message })

        if (portalUserError) {
          console.error('getCurrentUser: Portal user error:', portalUserError)
          return null
        }
        
        if (!portalUser) {
          console.log('getCurrentUser: No portal user found')
          return null
        }

        const result = {
          user,
          session,
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
        
        console.log('getCurrentUser: Success:', { userId: user.id, department: portalUser.department, roleKey: portalUser.role_key })
        return result
      } finally {
        // Clear the promise when done
        getCurrentUserPromise = null
      }
    })()
    
    // Add timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => {
        getCurrentUserPromise = null
        reject(new Error('getCurrentUser timeout'))
      }, 10000) // 10 second timeout
    )
    
    return await Promise.race([getCurrentUserPromise, timeoutPromise])
  } catch (error) {
    getCurrentUserPromise = null
    console.error('Get current user error:', error)
    return null
  }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export function isAuthenticated() {
  return getSession().then(session => session !== null)
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

