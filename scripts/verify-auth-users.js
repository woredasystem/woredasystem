// Script to verify auth users exist and are linked
// Run with: node scripts/verify-auth-users.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dfdgyzdyfqyivanfobap.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZGd5emR5ZnF5aXZhbmZvYmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc4MTcsImV4cCI6MjA3ODk2MzgxN30.UIzXdqBC_th1sEz86GF_dKo0C1pPIWh6hxhgA6gsbnk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyUsers() {
  console.log('🔍 Verifying portal users...\n')

  try {
    // Get all portal users
    const { data: portalUsers, error: portalError } = await supabase
      .from('portal_users')
      .select('*')
      .order('department')

    if (portalError) {
      console.error('❌ Error fetching portal_users:', portalError.message)
      return
    }

    if (!portalUsers || portalUsers.length === 0) {
      console.log('⚠️  No portal users found in database')
      console.log('   Run supabase-schema.sql first to create portal_users table')
      return
    }

    console.log(`Found ${portalUsers.length} portal users:\n`)

    // Check each user
    let allGood = true
    for (const user of portalUsers) {
      console.log(`📧 ${user.email}`)
      console.log(`   Department: ${user.department}`)
      console.log(`   Role: ${user.role_key}`)

      // Try to sign in to verify auth user exists
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: 'TEST_PASSWORD' // This will fail but we can check the error
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials') || authError.message.includes('Email not confirmed')) {
          // User exists but password might be wrong or not confirmed
          console.log(`   ✅ Auth user exists`)
          if (authError.message.includes('Email not confirmed')) {
            console.log(`   ⚠️  Email not confirmed - check Auto Confirm in dashboard`)
          }
        } else if (authError.message.includes('User not found') || authError.message.includes('Invalid login')) {
          console.log(`   ❌ Auth user does NOT exist`)
          console.log(`   💡 Create user in Supabase Dashboard → Authentication → Users`)
          allGood = false
        } else {
          console.log(`   ⚠️  Error: ${authError.message}`)
        }
      } else {
        console.log(`   ✅ Auth user exists and can login`)
        // Sign out immediately
        await supabase.auth.signOut()
      }

      // Check if linked
      if (user.user_id) {
        console.log(`   ✅ Linked to auth.users (user_id: ${user.user_id.substring(0, 8)}...)`)
      } else {
        console.log(`   ❌ Not linked to auth.users`)
        console.log(`   💡 Run: UPDATE portal_users SET user_id = (SELECT id FROM auth.users WHERE email = '${user.email}') WHERE email = '${user.email}';`)
        allGood = false
      }

      console.log('')
    }

    if (allGood) {
      console.log('✅ All users are properly set up!')
    } else {
      console.log('⚠️  Some users need attention. See above for details.')
      console.log('\n💡 To fix:')
      console.log('   1. Create missing auth users in Supabase Dashboard')
      console.log('   2. Run the UPDATE queries shown above to link users')
      console.log('   3. Or run: node scripts/create-portal-users.js <SERVICE_ROLE_KEY>')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

verifyUsers().catch(console.error)



