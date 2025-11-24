# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details (name, database password, region)
4. Wait for project to be created (~2 minutes)

### 3. Get Supabase Credentials
1. In your Supabase project dashboard, go to Settings → API
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 4. Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Set Up Database
1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" (or press Ctrl+Enter)
5. Verify tables were created by going to Table Editor

### 6. Set Up Automatic Escalation (Optional but Recommended)
1. In Supabase dashboard, go to Database → Extensions
2. Search for "pg_cron" and enable it
3. Go back to SQL Editor
4. Run this query to schedule daily escalation checks:

```sql
SELECT cron.schedule(
  'escalate-complaints-daily',
  '0 0 * * *',
  $$SELECT escalate_complaints()$$
);
```

### 7. Run the Application
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Testing the Application

### Test Complaint Submission
1. Click on "Complaints" (ቅሬታ)
2. Click "File Complaint" (ቅሬታ ስጥ)
3. Fill in the form and submit
4. Check Supabase Table Editor → `complaints` table to see the entry

### Test Appointment Booking
1. Click on "Appointments" (ቀጠሮ)
2. Click "Book Appointment" (ቀጠሮ ይዘዙ)
3. Fill in the form and submit
4. Check Supabase Table Editor → `appointments` table

### Test Language Toggle
1. Click the language button in the top-right
2. All text should switch between Amharic and English instantly

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct values
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env`

### Database connection errors
- Verify your Supabase project is active (not paused)
- Check that you ran the SQL schema script
- Ensure RLS policies allow public access (they should by default with our schema)

### Styling looks broken
- Make sure Tailwind CSS is properly configured
- Try clearing browser cache
- Check browser console for errors

## Next Steps

1. **Customize Branding**: Update logos and colors in components
2. **Add Official Photos**: Upload photos to `/public/officials/` folder
3. **Configure Email Notifications**: Set up Supabase email templates for escalations
4. **Deploy**: Use Vercel, Netlify, or similar for production deployment

## Production Deployment

1. Build the app: `npm run build`
2. The `dist/` folder contains production-ready files
3. Deploy to your hosting service
4. Update environment variables in your hosting platform
5. Ensure Supabase project is in production mode






