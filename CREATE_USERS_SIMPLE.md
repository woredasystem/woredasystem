# Quick User Creation Guide

## Method 1: Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Create these 5 users:

### Users to Create:

1. **Trade Office**
   - Email: `trade@woreda9.gov.et`
   - Password: `Trade2025!`
   - ✅ Check "Auto Confirm User"

2. **Civil Registration**
   - Email: `civil@woreda9.gov.et`
   - Password: `Civil2025!`
   - ✅ Check "Auto Confirm User"

3. **Labor & Skills**
   - Email: `labor@woreda9.gov.et`
   - Password: `Labor2025!`
   - ✅ Check "Auto Confirm User"

4. **CEO Office**
   - Email: `ceo@woreda9.gov.et`
   - Password: `CEO2025!`
   - ✅ Check "Auto Confirm User"

5. **Admin**
   - Email: `admin@woreda9.gov.et`
   - Password: `Admin2025!`
   - ✅ Check "Auto Confirm User"

## Method 2: Link Users (After Creating in Dashboard)

After creating the auth users, run this SQL in Supabase SQL Editor:

```sql
-- Link all portal users with auth users
UPDATE portal_users 
SET user_id = (SELECT id FROM auth.users WHERE email = 'trade@woreda9.gov.et')
WHERE email = 'trade@woreda9.gov.et';

UPDATE portal_users 
SET user_id = (SELECT id FROM auth.users WHERE email = 'civil@woreda9.gov.et')
WHERE email = 'civil@woreda9.gov.et';

UPDATE portal_users 
SET user_id = (SELECT id FROM auth.users WHERE email = 'labor@woreda9.gov.et')
WHERE email = 'labor@woreda9.gov.et';

UPDATE portal_users 
SET user_id = (SELECT id FROM auth.users WHERE email = 'ceo@woreda9.gov.et')
WHERE email = 'ceo@woreda9.gov.et';

UPDATE portal_users 
SET user_id = (SELECT id FROM auth.users WHERE email = 'admin@woreda9.gov.et')
WHERE email = 'admin@woreda9.gov.et';
```

## Verify Users Are Created

Run this query:

```sql
SELECT 
  pu.email,
  pu.department_am as "የስራ ክፍል (አማርኛ)",
  pu.department,
  CASE WHEN au.id IS NOT NULL THEN '✅ Linked' ELSE '❌ Not Linked' END as status
FROM portal_users pu
LEFT JOIN auth.users au ON pu.user_id = au.id
ORDER BY pu.department;
```

All should show "✅ Linked".

## Login Test

After setup, test login:
1. Go to portal access page
2. Select any department
3. Enter Amharic department name (pre-filled)
4. Enter password (e.g., `Trade2025!` for Trade Office)








