-- Forward Horizon Leads Table Migration
-- Run this in your Supabase SQL editor to create the leads table

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    program TEXT NOT NULL,
    risk_score INTEGER NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL DEFAULT 'Early',
    source TEXT NOT NULL DEFAULT 'Unknown',
    status TEXT NOT NULL DEFAULT 'New Lead',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    sla_deadline TIMESTAMPTZ NOT NULL,
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_risk_score ON public.leads(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_sla_deadline ON public.leads(sla_deadline);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_program ON public.leads(program);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON public.leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (you can customize this)
CREATE POLICY "Enable read access for authenticated users" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.leads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Or if you want public access for your API (less secure but simpler):
-- DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.leads;
-- DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.leads;
-- DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.leads;
-- 
-- CREATE POLICY "Enable all access for anon users" ON public.leads
--     FOR ALL USING (true);

-- Create some sample data (optional - remove in production)
-- INSERT INTO public.leads (first_name, last_name, email, phone, program, risk_score, risk_level, source, sla_deadline) VALUES
-- ('John', 'Doe', 'john.doe@example.com', '(555) 123-4567', 'Veterans Housing', 85, 'Critical', 'Google Ads', NOW() + INTERVAL '15 minutes'),
-- ('Jane', 'Smith', 'jane.smith@example.com', '(555) 987-6543', 'Recovery Housing', 45, 'Moderate', 'Main Website', NOW() + INTERVAL '1 day'),
-- ('Mike', 'Johnson', 'mike.j@example.com', '(555) 555-5555', 'Re-entry Support', 75, 'High', 'Referral', NOW() + INTERVAL '2 hours');

-- Grant permissions to service role
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.leads TO anon;