# Authentication System Audit Report

## Overview
The application uses Supabase Authentication with a custom portal user system. This audit reviews the current implementation and identifies potential issues.

## Current Implementation

### ✅ What's Working

1. **Supabase Client Configuration** (`src/lib/supabase.js`)
   - Properly configured with session persistence
   - Uses PKCE flow for security
   - Session storage configured

2. **Authentication Flow** (`src/utils/auth.js`)
   - Login function supports both Amharic department names and email addresses
   - Proper user lookup by `user_id` (preferred) and email (fallback)
   - Automatic linking of `user_id` if missing
   - Session management implemented
   - Auth state change listeners

3. **Protected Routes** (`src/App.jsx`)
   - Route protection for admin and department portals
   - Proper navigation guards
   - Auth state restoration on page load

4. **Login Component** (`src/components/PortalLogin.jsx`)
   - Bilingual support (Amharic/English)
   - Department name pre-filling
   - Error handling with timeout protection
   - Access control verification

### ⚠️ Issues Found

#### 1. **Missing `portal_users` Table Schema**
   - **Issue**: The `supabase-schema.sql` file does NOT include the `portal_users` table definition
   - **Impact**: Users cannot be created or linked without this table
   - **Location**: `supabase-schema.sql` is missing the table definition
   - **Required Fields** (based on code usage):
     - `id` (primary key)
     - `email` (unique, required)
     - `username` (required)
     - `full_name` (required)
     - `department` (required)
     - `department_am` (Amharic department name)
     - `role_key` (required)
     - `is_admin` (boolean, default false)
     - `user_id` (UUID, references auth.users.id)

#### 2. **Missing RLS Policies for `portal_users`**
   - **Issue**: No Row Level Security policies defined for `portal_users` table
   - **Impact**: Security vulnerability - table may be accessible to unauthorized users
   - **Note**: RLS_FIX.md mentions a policy "Public can read portal_users for login" but it's not in the schema

#### 3. **Missing `check_portal_user_access()` Function**
   - **Issue**: RLS_FIX.md references this function but it's not in `supabase-schema.sql`
   - **Impact**: RLS policies for complaints table may fail if they reference this function
   - **Required**: SECURITY DEFINER function to bypass RLS recursion

#### 4. **Missing `assigned_department` Field in Complaints**
   - **Issue**: Code references `complaint.assigned_department` but schema only has `department`
   - **Impact**: Department portals may not filter complaints correctly
   - **Location**: `src/views/DepartmentPortal.jsx` line 40, `src/views/AdminPortal.jsx` line 91

#### 5. **Missing `assigned_department` Field in Appointments**
   - **Issue**: Code references `appointment.assigned_department` but schema doesn't have this field
   - **Impact**: Department portals cannot filter appointments by department
   - **Location**: `src/views/DepartmentPortal.jsx` line 49

#### 6. **Hardcoded Credentials in Code**
   - **Issue**: Supabase URL and anon key are hardcoded as fallbacks
   - **Impact**: Security risk if code is committed to public repository
   - **Location**: `src/lib/supabase.js` lines 4-5

#### 7. **Public Read Access to All Complaints**
   - **Issue**: RLS policy allows anyone to view all complaints
   - **Impact**: Privacy concern - all complaint data is publicly accessible
   - **Location**: `supabase-schema.sql` line 85-86

## Required Fixes

### Priority 1: Critical (Blocks Functionality)

1. **Create `portal_users` Table**
   ```sql
   CREATE TABLE IF NOT EXISTS portal_users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     email TEXT UNIQUE NOT NULL,
     username TEXT NOT NULL,
     full_name TEXT NOT NULL,
     department TEXT NOT NULL,
     department_am TEXT,
     role_key TEXT NOT NULL,
     is_admin BOOLEAN DEFAULT FALSE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
   );
   
   CREATE INDEX IF NOT EXISTS idx_portal_users_email ON portal_users(email);
   CREATE INDEX IF NOT EXISTS idx_portal_users_user_id ON portal_users(user_id);
   CREATE INDEX IF NOT EXISTS idx_portal_users_role_key ON portal_users(role_key);
   ```

2. **Add Missing Fields to Existing Tables**
   ```sql
   -- Add assigned_department to complaints if it doesn't exist
   ALTER TABLE complaints 
   ADD COLUMN IF NOT EXISTS assigned_department TEXT;
   
   -- Add assigned_department to appointments if it doesn't exist
   ALTER TABLE appointments 
   ADD COLUMN IF NOT EXISTS assigned_department TEXT;
   ```

3. **Create `check_portal_user_access()` Function**
   ```sql
   CREATE OR REPLACE FUNCTION check_portal_user_access(check_department TEXT DEFAULT NULL)
   RETURNS BOOLEAN
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public
   AS $$
   DECLARE
     portal_user_record RECORD;
   BEGIN
     -- Get current authenticated user
     IF auth.uid() IS NULL THEN
       RETURN FALSE;
     END IF;
     
     -- Check if user exists in portal_users
     SELECT * INTO portal_user_record
     FROM portal_users
     WHERE user_id = auth.uid();
     
     IF NOT FOUND THEN
       RETURN FALSE;
     END IF;
     
     -- Admin has access to everything
     IF portal_user_record.is_admin THEN
       RETURN TRUE;
     END IF;
     
     -- If checking specific department, verify match
     IF check_department IS NOT NULL THEN
       RETURN portal_user_record.department = check_department;
     END IF;
     
     -- Otherwise, user is authenticated portal user
     RETURN TRUE;
   END;
   $$;
   ```

### Priority 2: Security

4. **Add RLS Policies for `portal_users`**
   ```sql
   ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
   
   -- Allow public read for login (needed for email lookup)
   CREATE POLICY "Public can read portal_users for login" ON portal_users
     FOR SELECT USING (true);
   
   -- Allow users to read their own record
   CREATE POLICY "Users can read own portal_user" ON portal_users
     FOR SELECT USING (user_id = auth.uid());
   ```

5. **Update Complaints RLS Policies**
   ```sql
   -- Drop existing overly permissive policy
   DROP POLICY IF EXISTS "Public can view complaints" ON complaints;
   
   -- Add department-specific access
   CREATE POLICY "Portal users can view department complaints" ON complaints
     FOR SELECT USING (check_portal_user_access(assigned_department));
   
   CREATE POLICY "Portal users can update department complaints" ON complaints
     FOR UPDATE USING (check_portal_user_access(assigned_department));
   ```

### Priority 3: Code Quality

6. **Remove Hardcoded Credentials**
   - Ensure `.env` file is in `.gitignore`
   - Remove hardcoded fallback values or use environment variables only

7. **Fix Department Mapping**
   - Verify all department names match between:
     - `src/utils/auth.js` (departmentToEmailMap)
     - `src/data/officials.js`
     - Database records

## Testing Checklist

- [ ] Portal users can be created via script
- [ ] Login works with Amharic department names
- [ ] Login works with email addresses
- [ ] Admin can access admin portal
- [ ] Department users can only access their department portal
- [ ] Department users can view their department's complaints
- [ ] Department users can update their department's complaints
- [ ] Admin can view all complaints
- [ ] Logout works correctly
- [ ] Session persists across page refreshes
- [ ] Auth state changes are properly handled

## Recommendations

1. **Immediate Action**: Create the missing `portal_users` table and required fields
2. **Security Review**: Tighten RLS policies to prevent unauthorized data access
3. **Documentation**: Update `supabase-schema.sql` to include all required tables and functions
4. **Testing**: Add integration tests for authentication flows
5. **Monitoring**: Add logging for authentication failures and successes

## Files to Update

1. `supabase-schema.sql` - Add missing table, fields, and functions
2. `src/lib/supabase.js` - Remove hardcoded credentials (optional, but recommended)
3. Documentation files - Update to reflect complete schema






