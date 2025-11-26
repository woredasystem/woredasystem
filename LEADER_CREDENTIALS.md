# Leader Portal Credentials

All 6 leaders now have portal access credentials:

## 1. ግርማ በቀለ (Girma Bekele) - Trade Office Head
- **Email**: `trade@woreda9.gov.et`
- **Password**: `Trade2025!`
- **Department (Amharic)**: ንግድ ጽ/ቤት
- **Role Key**: `trade_head`

## 2. ጋዲሳ ኢሉኩ (Gadisa Iluku) - Civil Registration Head
- **Email**: `civil@woreda9.gov.et`
- **Password**: `Civil2025!`
- **Department (Amharic)**: ሲቪል ምዝገባ
- **Role Key**: `civil_head`

## 3. ሻውል ታደሰ (Shawul Tadesse) - Labor & Skills Head
- **Email**: `labor@woreda9.gov.et`
- **Password**: `Labor2025!`
- **Department (Amharic)**: ስራና ክህሎት
- **Role Key**: `labor_head`

## 4. ለሊሳ ሲሪካ (Lelisa Sirika) - CEO Office Head
- **Email**: `ceo@woreda9.gov.et`
- **Password**: `CEO2025!`
- **Department (Amharic)**: ዋና ሥራ አስፈፃሚ ጽ/ቤት
- **Role Key**: `ceo_office_head`

## 5. ጫልቱ አያና (Chaltu Ayana) - Chief Executive
- **Email**: `chief.executive@woreda9.gov.et`
- **Password**: `Chief2025!`
- **Department (Amharic)**: ዋና ሥራ አስፈፃሚ
- **Role Key**: `ceo`

## 6. በየነች አንበሱ (Beyenech Anbesu) - Council Speaker
- **Email**: `council.speaker@woreda9.gov.et`
- **Password**: `Council2025!`
- **Department (Amharic)**: ወረዳ ምክር ቤት
- **Role Key**: `council_speaker`

## Admin Portal
- **Email**: `admin@woreda9.gov.et`
- **Password**: `Admin2025!`
- **Department (Amharic)**: አስተዳደር
- **Role Key**: `admin` (Full system access)

---

**Note**: To create auth users for the new leaders (Chief Executive and Council Speaker), run:
```bash
node scripts/create-portal-users.js <SERVICE_ROLE_KEY>
```

This will create auth accounts and link them to the portal_users table.








