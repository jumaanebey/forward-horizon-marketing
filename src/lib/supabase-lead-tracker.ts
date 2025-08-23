// Enhanced lead tracking system with Supabase database storage
// Provides secure, reliable lead storage with Google Sheets fallback

import { supabase } from './supabase';
import { calculateSLADeadline } from './lead-tracker';

interface SupabaseLead {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  program: string;
  risk_score: number;
  risk_level: string;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
  sla_deadline: string;
  notes?: string;
}

interface LeadData {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  program: string;
  riskScore: number;
  source: string;
}

// Save lead to Supabase with error handling
export async function saveLeadToSupabase(leadData: LeadData): Promise<SupabaseLead | null> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('⚠️ Supabase not configured - skipping database storage');
      return null;
    }

    const slaDeadline = calculateSLADeadline(leadData.riskScore);
    const riskLevel = leadData.riskScore >= 80 ? 'Critical' :
                      leadData.riskScore >= 60 ? 'High' :
                      leadData.riskScore >= 30 ? 'Moderate' : 'Early';

    const supabaseLead = {
      id: leadData.id,
      first_name: leadData.firstName,
      last_name: leadData.lastName || '',
      email: leadData.email,
      phone: leadData.phone || '',
      program: leadData.program,
      risk_score: leadData.riskScore,
      risk_level: riskLevel,
      source: leadData.source,
      status: 'New Lead',
      sla_deadline: slaDeadline.toISOString(),
      notes: `Lead created via ${leadData.source}`
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([supabaseLead])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return null;
    }

    console.log('✅ Lead saved to Supabase:', data.id);
    return data;

  } catch (error) {
    console.error('❌ Supabase save error:', error);
    return null;
  }
}

// Get overdue leads from Supabase
export async function getOverdueLeadsFromSupabase(): Promise<SupabaseLead[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [];
    }

    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['New Lead', 'Contacted', 'In Progress'])
      .lt('sla_deadline', now)
      .order('risk_score', { ascending: false })
      .order('sla_deadline', { ascending: true });

    if (error) {
      console.error('❌ Supabase query error:', error);
      return [];
    }

    console.log(`📊 Found ${data.length} overdue leads in Supabase`);
    return data || [];

  } catch (error) {
    console.error('❌ Supabase query error:', error);
    return [];
  }
}

// Update lead status in Supabase
export async function updateLeadStatusInSupabase(leadId: string, status: string, notes?: string): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false;
    }

    const updateData: any = { status };
    if (notes) {
      updateData.notes = notes;
    }

    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId);

    if (error) {
      console.error('❌ Supabase update error:', error);
      return false;
    }

    console.log(`✅ Lead ${leadId} status updated to: ${status}`);
    return true;

  } catch (error) {
    console.error('❌ Supabase update error:', error);
    return false;
  }
}

// Get lead statistics from Supabase
export async function getLeadStatsFromSupabase(): Promise<{
  total: number;
  overdue: number;
  critical: number;
  high: number;
  moderate: number;
  early: number;
}> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { total: 0, overdue: 0, critical: 0, high: 0, moderate: 0, early: 0 };
    }

    // Get total leads
    const { count: total } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Get overdue leads
    const now = new Date().toISOString();
    const { count: overdue } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .in('status', ['New Lead', 'Contacted', 'In Progress'])
      .lt('sla_deadline', now);

    // Get by risk level
    const { count: critical } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('risk_score', 80);

    const { count: high } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('risk_score', 60)
      .lt('risk_score', 80);

    const { count: moderate } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('risk_score', 30)
      .lt('risk_score', 60);

    const { count: early } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .lt('risk_score', 30);

    return {
      total: total || 0,
      overdue: overdue || 0,
      critical: critical || 0,
      high: high || 0,
      moderate: moderate || 0,
      early: early || 0
    };

  } catch (error) {
    console.error('❌ Supabase stats error:', error);
    return { total: 0, overdue: 0, critical: 0, high: 0, moderate: 0, early: 0 };
  }
}

// Get recent leads from Supabase
export async function getRecentLeadsFromSupabase(limit: number = 10): Promise<SupabaseLead[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Supabase query error:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('❌ Supabase query error:', error);
    return [];
  }
}

// Export all leads for backup/reporting
export async function exportLeadsFromSupabase(): Promise<any[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [];
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase export error:', error);
      return [];
    }

    return (data || []).map(lead => ({
      id: lead.id,
      name: `${lead.first_name} ${lead.last_name || ''}`.trim(),
      email: lead.email,
      phone: lead.phone || 'Not provided',
      program: lead.program,
      riskScore: lead.risk_score,
      riskLevel: lead.risk_level,
      source: lead.source,
      status: lead.status,
      createdAt: lead.created_at,
      slaDeadline: lead.sla_deadline,
      minutesUntilDeadline: Math.round((new Date(lead.sla_deadline).getTime() - new Date().getTime()) / (1000 * 60)),
      notes: lead.notes
    }));

  } catch (error) {
    console.error('❌ Supabase export error:', error);
    return [];
  }
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;

  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
}