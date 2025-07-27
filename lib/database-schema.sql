-- Forward Horizon Lead Management Database Schema
-- Run this in your Supabase SQL editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  form_type TEXT NOT NULL CHECK (form_type IN ('veterans', 'recovery', 'reentry')),
  source TEXT NOT NULL DEFAULT 'marketing_funnel',
  campaign_id TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  phone TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  lead_value DECIMAL DEFAULT 25.00,
  pdf_delivered BOOLEAN DEFAULT true,
  email_sequence_step INTEGER DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Create contacts table for tracking interactions
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  contact_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone', 'in_person', 'text', 'voicemail')),
  notes TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('positive', 'neutral', 'negative', 'no_response')),
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  staff_member TEXT NOT NULL,
  duration_minutes INTEGER,
  follow_up_required BOOLEAN DEFAULT false
);

-- Create campaigns table for tracking marketing performance
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('google_ads', 'facebook_ads', 'organic', 'referral', 'direct')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  budget DECIMAL DEFAULT 0,
  spent DECIMAL DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  cost_per_lead DECIMAL DEFAULT 0,
  conversion_rate DECIMAL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  target_audience TEXT,
  ad_copy TEXT,
  landing_page TEXT
);

-- Create staff table for user management
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'staff', 'readonly')),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  phone TEXT,
  department TEXT
);

-- Create analytics table for daily metrics
CREATE TABLE daily_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  leads_generated INTEGER DEFAULT 0,
  leads_contacted INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  average_cost_per_lead DECIMAL DEFAULT 0,
  conversion_rate DECIMAL DEFAULT 0,
  website_visitors INTEGER DEFAULT 0,
  form_completions INTEGER DEFAULT 0,
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0
);

-- Create email sequences table
CREATE TABLE email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  email_subject TEXT,
  email_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'))
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_form_type ON leads(form_type);
CREATE INDEX idx_contacts_lead_id ON contacts(lead_id);
CREATE INDEX idx_contacts_contact_date ON contacts(contact_date);
CREATE INDEX idx_campaigns_type ON campaigns(type);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Create views for common queries
CREATE VIEW lead_summary AS
SELECT 
  l.*,
  COUNT(c.id) as contact_count,
  MAX(c.contact_date) as last_contact_date,
  CASE 
    WHEN l.created_at > NOW() - INTERVAL '24 hours' THEN 'hot'
    WHEN l.created_at > NOW() - INTERVAL '72 hours' THEN 'warm'
    ELSE 'cold'
  END as lead_temperature
FROM leads l
LEFT JOIN contacts c ON l.id = c.lead_id
GROUP BY l.id;

CREATE VIEW campaign_performance AS
SELECT 
  c.*,
  COUNT(l.id) as actual_leads,
  AVG(CASE WHEN l.status = 'converted' THEN 1.0 ELSE 0.0 END) as actual_conversion_rate,
  CASE WHEN COUNT(l.id) > 0 THEN c.spent / COUNT(l.id) ELSE 0 END as actual_cost_per_lead
FROM campaigns c
LEFT JOIN leads l ON l.campaign_id = c.id::text
GROUP BY c.id;

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - you may want to customize based on your needs)
CREATE POLICY "Enable read access for authenticated users" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON leads FOR UPDATE USING (auth.role() = 'authenticated');

-- Repeat similar policies for other tables
CREATE POLICY "Enable all access for authenticated users" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON staff FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON daily_metrics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON email_sequences FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO staff (email, name, role) VALUES 
('admin@theforwardhorizon.com', 'Admin User', 'admin');

INSERT INTO campaigns (name, type, start_date, target_audience, landing_page) VALUES 
('Google Ads - Veterans Housing', 'google_ads', CURRENT_DATE, 'California Veterans', '/veterans-housing'),
('Facebook Ads - Recovery Housing', 'facebook_ads', CURRENT_DATE, 'Recovery Community', '/recovery-housing'),
('Organic - Re-entry Support', 'organic', CURRENT_DATE, 'Returning Citizens', '/reentry-support');