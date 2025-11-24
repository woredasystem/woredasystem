# RLS Infinite Recursion Fix

## Problem
The complaint form was failing with error: `infinite recursion detected in policy for relation "portal_users"`

## Root Cause
The RLS policies for `complaints` table were checking `portal_users` table, which had RLS enabled. When evaluating policies, Supabase would check if the user can read from `portal_users`, which would trigger the `portal_users` policies, which might reference `portal_users` again, creating infinite recursion.

## Solution
Created a `SECURITY DEFINER` function `check_portal_user_access()` that bypasses RLS when checking portal user access. This function:

1. Runs with elevated privileges (bypasses RLS)
2. Checks if the current user (auth.uid()) exists in portal_users
3. Returns true if user is admin or matches the department
4. Returns false if user is not authenticated or not found

## Changes Made

### 1. Created Function
```sql
CREATE OR REPLACE FUNCTION check_portal_user_access(check_department TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
```

### 2. Updated Policies
- **Complaints SELECT Policy**: Now uses `check_portal_user_access(assigned_department)`
- **Complaints UPDATE Policy**: Now uses `check_portal_user_access(assigned_department)`
- **Portal Users SELECT Policy**: Simplified to allow public read (needed for login)

### 3. Removed Recursive Policies
- Dropped "Portal users can view all portal users" policy that was causing recursion

## Current Policies

### Complaints Table
- ✅ **Public can insert complaints**: Allows anyone to insert (WITH CHECK true)
- ✅ **Public can view complaints by unique code**: Allows public to view for follow-up
- ✅ **Portal users can view department complaints**: Uses function (no recursion)
- ✅ **Portal users can update department complaints**: Uses function (no recursion)

### Portal Users Table
- ✅ **Public can read portal_users for login**: Allows public read (needed for login by email)

## Testing
The complaint form should now work without recursion errors. The function safely checks portal user access without creating circular dependencies.





