# Complaint Forms Update

This document describes the implementation of the new complaint forms system based on Form 01 (Complaint Submission) and Form 02 (Complaint Response).

## Changes Made

### 1. Database Schema Migration
A new migration file `supabase-complaint-forms-migration.sql` has been created with all the new fields required for both forms. **You need to run this migration in your Supabase SQL Editor.**

The migration adds:
- **Form 01 fields**: complainant age, gender, submission type (individual/group), address fields, submission institution, previous written response, complaint main content, requested solution, signature, and acknowledgment fields
- **Form 02 fields**: complaint submission date, appeal content, investigation status, investigation findings, summary response, action to be taken, expert information, and final decision fields

### 2. Updated Components

#### ComplaintForm.jsx (Form 01)
- Updated to match the new Form 01 structure
- Includes all sections:
  1. Complainant full name, age, gender
  2. Submission type (individual/group)
  3. Address information (subcity, woreda, house number, phone, email)
  4. Submission institution
  5. Previous written response
  6. Main content of complaint/appeal
  7. Requested solution
  8. Target official selection
  9. Complainant signature

#### ComplaintResponseForm.jsx (Form 02) - NEW
- New component for offices to respond to complaints
- Includes all sections:
  1. Complainant information (display only)
  2. Submission date and institution
  3. Appeal content
  4. Investigation status (properly investigated or not)
  5. Investigation findings
  6. Summary response (correct/incorrect)
  7. Action to be taken (if complaint is correct)
  8. Expert information (name, signature, date)
  9. Final decision (responsible person, signature, date)

#### DepartmentPortal.jsx
- Updated to use the new ComplaintResponseForm instead of simple prompt
- When a complaint is "In Progress", clicking "Respond" opens Form 02

#### AdminComplaintResolution.jsx
- Updated to use ComplaintResponseForm (Form 02) instead of simple resolution form

### 3. Translations
Added comprehensive translations for all new form fields in both Amharic and English in `src/lib/translations.js`.

## Next Steps

1. **Run the database migration**: Execute `supabase-complaint-forms-migration.sql` in your Supabase SQL Editor to add all the new fields to the `complaints` table.

2. **Test the forms**:
   - Test Form 01 by filing a new complaint
   - Test Form 02 by responding to a complaint from the department portal

3. **Verify data**: Check that all new fields are being saved correctly in the database.

## Form Structure

### Form 01 (ቅፅ-01): Complaint/Appeal Submission
Used by citizens to file complaints. Includes comprehensive information about the complainant and the complaint.

### Form 02 (ቅፅ-02): Complaint/Appeal Response Provider
Used by offices to provide formal responses to complaints. Includes investigation details, findings, and official decisions.

## Notes

- The forms maintain backward compatibility with existing complaint data
- All new fields are optional except where marked as required
- The system automatically handles status updates based on Form 02 responses
- Form 02 pre-fills with existing complaint data when available

