// Script to create portal users in Supabase Auth
// Run with: node scripts/create-portal-users.js
// Usage: node scripts/create-portal-users.js <SERVICE_ROLE_KEY>

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dfdgyzdyfqyivanfobap.supabase.co'
const serviceRoleKey = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.error('❌ Error: Service Role Key is required')
  console.log('\nUsage:')
  console.log('  node scripts/create-portal-users.js <SERVICE_ROLE_KEY>')
  console.log('\nOr set environment variable:')
  console.log('  SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/create-portal-users.js')
  console.log('\nTo get your service role key:')
  console.log('1. Go to Supabase Dashboard → Settings → API')
  console.log('2. Copy the "service_role" key (NOT the anon key)')
  console.log('⚠️  Keep this key secret! Never commit it to git.')
  process.exit(1)
}

// Create Supabase client with service role key (admin access)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const portalUsers = [
  {
    email: 'trade@woreda9.gov.et',
    password: 'Trade2025!',
    username: 'trade',
    fullName: 'Trade Office Staff',
    department: 'Trade Office',
    departmentAm: 'ንግድ ጽ/ቤት',
    roleKey: 'trade_head',
    isAdmin: false
  },
  {
    email: 'civil@woreda9.gov.et',
    password: 'Civil2025!',
    username: 'civil',
    fullName: 'Civil Registration Staff',
    department: 'Civil Registration',
    departmentAm: 'ሲቪል ምዝገባ',
    roleKey: 'civil_head',
    isAdmin: false
  },
  {
    email: 'labor@woreda9.gov.et',
    password: 'Labor2025!',
    username: 'labor',
    fullName: 'Labor & Skills Staff',
    department: 'Labor & Skills',
    departmentAm: 'ስራና ክህሎት',
    roleKey: 'labor_head',
    isAdmin: false
  },
  {
    email: 'ceo@woreda9.gov.et',
    password: 'CEO2025!',
    username: 'ceo',
    fullName: 'CEO Office Staff',
    department: 'Chief Executive Office',
    departmentAm: 'ዋና ሥራ አስፈፃሚ ጽ/ቤት',
    roleKey: 'ceo_office_head',
    isAdmin: false
  },
  {
    email: 'chief.executive@woreda9.gov.et',
    password: 'Chief2025!',
    username: 'chief_executive',
    fullName: 'ጫልቱ አያና',
    department: 'Chief Executive',
    departmentAm: 'ዋና ሥራ አስፈፃሚ',
    roleKey: 'ceo',
    isAdmin: false
  },
  {
    email: 'council.speaker@woreda9.gov.et',
    password: 'Council2025!',
    username: 'council_speaker',
    fullName: 'በየነች አንበሱ',
    department: 'Woreda Council',
    departmentAm: 'ወረዳ ምክር ቤት',
    roleKey: 'council_speaker',
    isAdmin: false
  },
  {
    email: 'admin@woreda9.gov.et',
    password: 'Admin2025!',
    username: 'admin',
    fullName: 'System Administrator',
    department: 'Admin',
    departmentAm: 'አስተዳደር',
    roleKey: 'admin',
    isAdmin: true
  }
]

async function createUsers() {
  console.log('🚀 Starting user creation process...\n')

  for (const userData of portalUsers) {
    try {
      console.log(`Creating user: ${userData.email} (${userData.departmentAm})...`)

      // Create auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          department: userData.department,
          department_am: userData.departmentAm,
          role_key: userData.roleKey
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${userData.email} already exists, updating...`)
          
          // Get existing user
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
          const existingUser = existingUsers.users.find(u => u.email === userData.email)
          
          if (existingUser) {
            // Update portal_users table with user_id
            const { error: updateError } = await supabaseAdmin
              .from('portal_users')
              .update({ 
                user_id: existingUser.id,
                department_am: userData.departmentAm
              })
              .eq('email', userData.email)

            if (updateError) {
              console.error(`❌ Error updating portal_users: ${updateError.message}`)
            } else {
              console.log(`✅ Updated portal_users for ${userData.email}`)
            }
          }
          continue
        } else {
          throw authError
        }
      }

      if (!authUser.user) {
        throw new Error('User creation failed - no user returned')
      }

      console.log(`✅ Auth user created: ${authUser.user.id}`)

      // Update portal_users table with user_id and department_am
      const { error: updateError } = await supabaseAdmin
        .from('portal_users')
        .update({ 
          user_id: authUser.user.id,
          department_am: userData.departmentAm
        })
        .eq('email', userData.email)

      if (updateError) {
        console.error(`❌ Error updating portal_users: ${updateError.message}`)
      } else {
        console.log(`✅ Portal user linked: ${userData.email}`)
      }

      console.log(`✅ Successfully created: ${userData.email} (${userData.departmentAm})\n`)

    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message)
      console.log('')
    }
  }

  console.log('✨ User creation process completed!')
  console.log('\n📋 Summary:')
  console.log('You can now login with:')
  portalUsers.forEach(user => {
    console.log(`  - ${user.departmentAm}: Password you set above`)
  })
}

// Run the script
createUsers().catch(console.error)

