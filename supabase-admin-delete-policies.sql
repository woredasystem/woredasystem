-- Admin Delete Policies Migration
-- This adds DELETE policies for complaints and appointments
-- Only admins can delete records
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- DELETE Policies for complaints
-- ============================================================================

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Admins can delete complaints" ON complaints;

-- Admins can delete any complaint
-- The check_portal_user_access() function already checks for admin status
CREATE POLICY "Admins can delete complaints" ON complaints
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    check_portal_user_access() AND
    EXISTS (
      SELECT 1 FROM portal_users
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================================
-- DELETE Policies for appointments
-- ============================================================================

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Admins can delete appointments" ON appointments;

-- Admins can delete any appointment
-- The check_portal_user_access() function already checks for admin status
CREATE POLICY "Admins can delete appointments" ON appointments
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    check_portal_user_access() AND
    EXISTS (
      SELECT 1 FROM portal_users
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

