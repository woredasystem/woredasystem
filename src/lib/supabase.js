import { createClient } from '@supabase/supabase-js'

// Woreda 9 Digital Portal - Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfdgyzdyfqyivanfobap.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZGd5emR5ZnF5aXZhbmZvYmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc4MTcsImV4cCI6MjA3ODk2MzgxN30.UIzXdqBC_th1sEz86GF_dKo0C1pPIWh6hxhgA6gsbnk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage, // Use localStorage for session persistence across page refreshes
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

