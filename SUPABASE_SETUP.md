# Supabase Setup for Forward Horizon

This guide will help you set up Supabase for dual storage (Supabase + Google Sheets).

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New project"
3. Choose organization and enter project details:
   - **Name**: `forward-horizon-leads`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public key** (starts with `eyJ`)

## Step 3: Add Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase_migration.sql`
4. Click "Run" to execute the migration

## Step 5: Configure Security (Optional)

The migration includes Row Level Security (RLS) policies. You can:

- **Keep authenticated access**: More secure, requires user login
- **Switch to public access**: Simpler, but less secure

To switch to public access, run this in SQL Editor:

```sql
-- Remove authenticated policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.leads;

-- Add public policy (less secure but simpler)
CREATE POLICY "Enable all access for anon users" ON public.leads
    FOR ALL USING (true);
```

## Step 6: Test the Setup

1. Deploy your app to Vercel
2. Submit a test lead through your contact form
3. Check both:
   - Your Google Sheet (should still work)
   - Supabase dashboard → **Table Editor** → `leads` table

## Verification

Your app now has **dual storage**:
- ✅ **Google Sheets**: For your familiar dashboard workflow
- ✅ **Supabase**: For secure, reliable database storage
- ✅ **Failover**: If Supabase is down, Google Sheets continues working

## Benefits

1. **Reliability**: Database backup if Google Sheets has issues
2. **Security**: Proper database with authentication
3. **Performance**: Fast queries for dashboard and monitoring
4. **Scalability**: Can handle thousands of leads
5. **Continuity**: Your existing Google Sheets workflow unchanged

## Troubleshooting

**"Supabase not configured" warnings**: Normal if environment variables aren't set - app falls back to Google Sheets only.

**Build errors**: Make sure both environment variables are set in Vercel.

**Database connection failed**: Check your Project URL and Anon Key are correct.