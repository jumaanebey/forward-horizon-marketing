import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not found - running without database storage');
}

export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient(supabaseUrl, supabaseAnonKey) : 
  null;

// Types for our leads table
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program: string;
  risk_score: number;
  risk_level: string;
  source: string;
  status: string;
  created_at: string;
  sla_deadline: string;
  updated_at?: string;
  notes?: string;
}

// Database operations
export const supabaseOperations = {
  // Insert new lead
  async insertLead(lead: Omit<Lead, 'created_at' | 'updated_at'>): Promise<Lead | null> {
    if (!supabase) {
      console.log('📝 Supabase not configured - skipping database insert');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...lead,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        return null;
      }

      console.log('✅ Lead saved to Supabase:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Supabase operation failed:', error);
      return null;
    }
  },

  // Get all leads
  async getAllLeads(): Promise<Lead[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase fetch error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Supabase fetch failed:', error);
      return [];
    }
  },

  // Update lead status
  async updateLeadStatus(id: string, status: string, notes?: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status, 
          notes, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase update error:', error);
        return false;
      }

      console.log('✅ Lead status updated in Supabase:', id);
      return true;
    } catch (error) {
      console.error('❌ Supabase update failed:', error);
      return false;
    }
  },

  // Get overdue leads
  async getOverdueLeads(): Promise<Lead[]> {
    if (!supabase) return [];

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .lt('sla_deadline', now)
        .neq('status', 'Completed')
        .neq('status', 'Closed')
        .order('sla_deadline', { ascending: true });

      if (error) {
        console.error('❌ Supabase overdue query error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Supabase overdue query failed:', error);
      return [];
    }
  },

  // Get lead statistics
  async getLeadStats(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    completed: number;
    overdue: number;
    critical: number;
    high: number;
    moderate: number;
    early: number;
  }> {
    if (!supabase) {
      return {
        total: 0,
        pending: 0,
        contacted: 0,
        completed: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        moderate: 0,
        early: 0
      };
    }

    try {
      const { data: allLeads, error } = await supabase
        .from('leads')
        .select('status, risk_score, sla_deadline');

      if (error) {
        console.error('❌ Supabase stats error:', error);
        return {
          total: 0,
          pending: 0,
          contacted: 0,
          completed: 0,
          overdue: 0,
          critical: 0,
          high: 0,
          moderate: 0,
          early: 0
        };
      }

      const now = new Date();
      const leads = data || [];

      return {
        total: leads.length,
        pending: leads.filter(l => l.status === 'New Lead').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        completed: leads.filter(l => l.status === 'Completed').length,
        overdue: leads.filter(l => new Date(l.sla_deadline) < now && !['Completed', 'Closed'].includes(l.status)).length,
        critical: leads.filter(l => l.risk_score >= 80).length,
        high: leads.filter(l => l.risk_score >= 60 && l.risk_score < 80).length,
        moderate: leads.filter(l => l.risk_score >= 30 && l.risk_score < 60).length,
        early: leads.filter(l => l.risk_score < 30).length
      };
    } catch (error) {
      console.error('❌ Supabase stats failed:', error);
      return {
        total: 0,
        pending: 0,
        contacted: 0,
        completed: 0,
        overdue: 0,
        critical: 0,
        high: 0,
        moderate: 0,
        early: 0
      };
    }
  }
};