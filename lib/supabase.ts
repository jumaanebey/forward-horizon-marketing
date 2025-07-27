import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Lead {
  id: string
  created_at: string
  first_name: string
  email: string
  form_type: 'veterans' | 'recovery' | 'reentry'
  source: string
  campaign_id?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  notes?: string
  phone?: string
  last_contacted?: string
  assigned_to?: string
  lead_value: number
  pdf_delivered: boolean
  email_sequence_step: number
}

export interface Contact {
  id: string
  created_at: string
  lead_id?: string
  contact_date: string
  contact_type: 'email' | 'phone' | 'in_person' | 'text'
  notes: string
  outcome: 'positive' | 'neutral' | 'negative'
  next_action?: string
  next_action_date?: string
  staff_member: string
}

export interface Campaign {
  id: string
  created_at: string
  name: string
  type: 'google_ads' | 'facebook_ads' | 'organic' | 'referral'
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  leads_generated: number
  cost_per_lead: number
  conversion_rate: number
  start_date: string
  end_date?: string
}