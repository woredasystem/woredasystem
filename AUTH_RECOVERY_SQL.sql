-- Authentication System Recovery SQL Script
-- Run this ONLY if the auth system breaks after improvements
-- This restores the database to a working state

-- ============================================================================
-- Verify Current State
-- ============================================================================

-- Check portal_users table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'portal_users'
  ) THEN
    RAISE EXCEPTION 'portal_users table does not exist. Run supabase-auth-migration.sql first.';
  END IF;
END $$;

-- Check check_portal_user_access function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_proc 
    WHERE proname = 'check_portal_user_access'
  ) THEN
    RAISE EXCEPTION 'check_portal_user_access function does not exist. Run supabase-auth-migration.sql first.';
  END IF;
END $$;

-- ============================================================================
-- Verify RLS Policies
-- ============================================================================

-- Ensure portal_users has correct RLS policies
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Public can read portal_users for login" ON portal_users;
DROP POLICY IF EXISTS "Users can read own portal_user" ON portal_users;

CREATE POLICY "Public can read portal_users for login" ON portal_users
  FOR SELECT USING (true);

CREATE POLICY "Users can read own portal_user" ON portal_users
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- Verify Complaints RLS Policies
-- ============================================================================

-- Ensure complaints table has correct policies
DROP POLICY IF EXISTS "Portal users can view department complaints" ON complaints;
DROP POLICY IF EXISTS "Portal users can update department complaints" ON complaints;
DROP POLICY IF EXISTS "Portal users can insert complaints" ON complaints;

CREATE POLICY "Portal users can view department complaints" ON complaints
  FOR SELECT USING (
    -- Public can still view (for follow-up by ticket number)
    true
    OR
    -- Portal users can view their department's complaints
    (auth.uid() IS NOT NULL AND check_portal_user_access(assigned_department))
  );

CREATE POLICY "Portal users can update department complaints" ON complaints
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND check_portal_user_access(assigned_department)
  );

CREATE POLICY "Portal users can insert complaints" ON complaints
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND check_portal_user_access()
  );

-- ============================================================================
-- Verify Appointments RLS Policies
-- ============================================================================

-- Ensure appointments table has correct policies
DROP POLICY IF EXISTS "Portal users can view department appointments" ON appointments;
DROP POLICY IF EXISTS "Portal users can update department appointments" ON appointments;

CREATE POLICY "Portal users can view department appointments" ON appointments
  FOR SELECT USING (
    -- Public can still view (for follow-up)
    true
    OR
    -- Portal users can view their department's appointments
    (auth.uid() IS NOT NULL AND check_portal_user_access(assigned_department))
  );

CREATE POLICY "Portal users can update department appointments" ON appointments
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND check_portal_user_access(assigned_department)
  );

-- ============================================================================
-- Verify Portal Users Data
-- ============================================================================

-- Check if portal users exist
SELECT 
  email,
  department,
  role_key,
  is_admin,
  CASE WHEN user_id IS NOT NULL THEN '✅ Linked' ELSE '❌ Not Linked' END as auth_status
FROM portal_users
ORDER BY department;

-- ============================================================================
-- Fix Missing User Links (if needed)
-- ============================================================================

-- This will attempt to link portal_users to auth.users by email
-- Only run if you have users in auth.users but not linked in portal_users
-- Uncomment and modify as needed:

/*
UPDATE portal_users pu
SET user_id = au.id
FROM auth.users au
WHERE pu.email = au.email
  AND pu.user_id IS NULL;
*/

-- ============================================================================
-- Verification Queries (Run these to verify everything is working)
-- ============================================================================

-- 1. Check portal_users count
-- SELECT COUNT(*) as portal_user_count FROM portal_users;

-- 2. Check linked users
-- SELECT 
--   COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked_count,
--   COUNT(*) FILTER (WHERE user_id IS NULL) as unlinked_count
-- FROM portal_users;

-- 3. Check RLS policies
-- SELECT tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

-- 4. Test check_portal_user_access function (requires auth context)
-- SELECT check_portal_user_access();

-- ============================================================================
-- Recovery Complete
-- ============================================================================

-- If you see this message, the recovery script ran successfully
-- If there were any errors, check the error messages above
-- For code recovery, see AUTH_RECOVERY_BACKUP.md




