# Forward Horizon Dashboard Setup Guide

## Overview
This guide helps you set up the integrated lead management dashboard that connects your marketing funnel with a complete business management system.

## Prerequisites
- Existing marketing funnel (already deployed)
- Supabase account (free tier available)
- Vercel deployment access

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/sign in
3. Click "New Project"
4. Choose organization and project name: "forward-horizon"
5. Set database password (save this!)
6. Select region closest to your users
7. Click "Create new project"

### 1.2 Run Database Schema
1. Wait for project to finish setting up
2. Go to "SQL Editor" in your Supabase dashboard
3. Copy the contents of `lib/database-schema.sql`
4. Paste into SQL editor
5. Click "Run" to create all tables and setup

### 1.3 Get Environment Variables
In your Supabase project:
1. Go to "Settings" → "API"
2. Copy the following values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`)

## Step 2: Update Vercel Environment Variables

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add these new variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Deploy Dashboard Updates

```bash
git add .
git commit -m "Add lead management dashboard integration"
git push
```

Vercel will automatically redeploy with the new dashboard.

## Step 4: Access Your Dashboard

Once deployed, visit: `your-vercel-url.com/dashboard`

### Dashboard Features:
- **Overview** - Key metrics and recent leads
- **Leads** - Complete lead management with filtering
- **Analytics** - Performance tracking
- **Campaigns** - Marketing campaign management
- **Email Sequences** - Automated email tracking

## Step 5: Database Tables Explained

### `leads` Table
- Stores all marketing form submissions
- Tracks lead status and progression
- Includes source attribution and contact history

### `contacts` Table  
- Records all interactions with leads
- Tracks phone calls, emails, meetings
- Includes notes and follow-up scheduling

### `campaigns` Table
- Manages marketing campaign data
- Tracks budget, spend, and performance
- Links to Google Ads and Facebook campaigns

### `staff` Table
- User management for dashboard access
- Role-based permissions
- Activity tracking

### `daily_metrics` Table
- Aggregated daily performance data
- Used for trend analysis and reporting

## Step 6: Data Migration

Your existing marketing leads will automatically start saving to the database. Historical leads from before the dashboard setup will need to be manually imported if needed.

## Step 7: Security Configuration

### Row Level Security (RLS)
- All tables have RLS enabled
- Only authenticated users can access data
- Customize policies based on your needs

### Authentication Setup (Optional)
To add proper user authentication:
1. Go to Supabase → Authentication → Settings
2. Configure email/password authentication
3. Add user sign-up restrictions
4. Set up email templates

## Troubleshooting

### Common Issues:

**Database Connection Failed**
- Check Supabase environment variables
- Verify project URL is correct
- Ensure anon key has proper permissions

**Tables Not Found**
- Run the database schema SQL again
- Check for SQL errors in Supabase logs
- Verify all tables were created

**Dashboard Not Loading**
- Check browser console for errors
- Verify all environment variables are set
- Redeploy after adding variables

### Support
- Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Check Vercel function logs for errors
- Review database logs in Supabase dashboard

## Next Steps

Once the dashboard is running:
1. **Test lead capture** - Submit a form and verify it appears in dashboard
2. **Add staff users** - Create accounts for team members
3. **Configure notifications** - Set up lead alerts
4. **Customize dashboard** - Modify for your specific needs
5. **Train team** - Show staff how to use the system

## Advanced Features

### Email Sequence Automation
- Automated follow-up emails
- Drip campaigns based on lead behavior
- Performance tracking and optimization

### Reporting & Analytics
- Daily/weekly/monthly reports
- Lead source attribution
- Campaign ROI analysis
- Conversion funnel analysis

### Integrations
- Google Ads API for automated bid management
- Facebook Ads API for campaign optimization
- Third-party CRM connections
- Communication tools (Slack, Teams, etc.)

The dashboard provides a complete business management solution integrated with your marketing funnel!