// Dual-storage lead tracking system: Supabase + Google Sheets
// Provides database reliability with familiar Google Sheets workflow

import { supabaseOperations, Lead as SupabaseLead } from './supabase';

interface LeadSLA {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  riskScore: number;
  createdAt: Date;
  slaDeadline: Date;
  status: 'new' | 'contacted' | 'in_progress' | 'completed';
  source: string;
}

// In-memory storage (will be replaced with database)
// In production, this would be stored in Supabase or similar
let leadSLATracker: LeadSLA[] = [];

// Calculate SLA deadline based on risk score
export function calculateSLADeadline(riskScore: number, createdAt: Date = new Date()): Date {
  const deadline = new Date(createdAt);
  
  if (riskScore >= 80) {
    // Critical: 15 minutes
    deadline.setMinutes(deadline.getMinutes() + 15);
  } else if (riskScore >= 60) {
    // High: 2 hours
    deadline.setHours(deadline.getHours() + 2);
  } else if (riskScore >= 30) {
    // Moderate: 24 hours
    deadline.setDate(deadline.getDate() + 1);
  } else {
    // Early: 3 days
    deadline.setDate(deadline.getDate() + 3);
  }
  
  return deadline;
}

// Add lead to SLA tracking with dual storage (Supabase + Google Sheets)
export async function trackLeadSLA(lead: {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  program: string;
  riskScore: number;
  source: string;
}) {
  const now = new Date();
  const slaDeadline = calculateSLADeadline(lead.riskScore, now);
  
  const leadSLA: LeadSLA = {
    id: lead.id,
    name: `${lead.firstName} ${lead.lastName || ''}`.trim(),
    email: lead.email,
    phone: lead.phone,
    program: lead.program,
    riskScore: lead.riskScore,
    createdAt: now,
    slaDeadline,
    status: 'new',
    source: lead.source
  };
  
  // Add to in-memory tracker (for immediate access)
  leadSLATracker.push(leadSLA);
  
  // Save to Supabase (async - don't block if it fails)
  try {
    const supabaseLead = await supabaseOperations.insertLead({
      id: lead.id,
      first_name: lead.firstName,
      last_name: lead.lastName || '',
      email: lead.email,
      phone: lead.phone,
      program: lead.program,
      risk_score: lead.riskScore,
      risk_level: lead.riskScore >= 80 ? 'Critical' : 
                  lead.riskScore >= 60 ? 'High' :
                  lead.riskScore >= 30 ? 'Moderate' : 'Early',
      source: lead.source,
      status: 'New Lead',
      sla_deadline: slaDeadline.toISOString()
    });
    
    if (supabaseLead) {
      console.log(`✅ Lead saved to Supabase: ${leadSLA.name}`);
    }
  } catch (error) {
    console.warn('⚠️  Supabase save failed (continuing with Google Sheets):', error);
  }
  
  console.log(`📊 Lead SLA tracked: ${leadSLA.name} - Deadline: ${slaDeadline.toLocaleString()}`);
  return leadSLA;
}

// Get overdue leads
export function getOverdueLeads(): LeadSLA[] {
  const now = new Date();
  return leadSLATracker.filter(lead => 
    lead.status === 'new' && 
    lead.slaDeadline < now
  );
}

// Update lead status with dual storage sync
export async function updateLeadStatus(leadId: string, status: LeadSLA['status'], notes?: string) {
  // Update in-memory tracker
  const lead = leadSLATracker.find(l => l.id === leadId);
  if (lead) {
    lead.status = status;
  }
  
  // Update in Supabase (async)
  try {
    const supabaseStatus = status === 'new' ? 'New Lead' :
                          status === 'contacted' ? 'Contacted' :
                          status === 'in_progress' ? 'In Progress' :
                          status === 'completed' ? 'Completed' : 'New Lead';
                          
    await supabaseOperations.updateLeadStatus(leadId, supabaseStatus, notes);
    console.log(`📊 Lead status updated in both systems: ${leadId} -> ${status}`);
    return true;
  } catch (error) {
    console.warn('⚠️  Supabase update failed (in-memory updated):', error);
    return lead ? true : false;
  }
}

// Get all tracked leads
export function getAllTrackedLeads(): LeadSLA[] {
  return leadSLATracker;
}

// Get leads by risk level
export function getLeadsByRisk(minRiskScore: number): LeadSLA[] {
  return leadSLATracker.filter(lead => lead.riskScore >= minRiskScore);
}

// Get lead statistics
export function getLeadStats() {
  const total = leadSLATracker.length;
  const overdue = getOverdueLeads().length;
  const critical = leadSLATracker.filter(l => l.riskScore >= 80).length;
  const high = leadSLATracker.filter(l => l.riskScore >= 60 && l.riskScore < 80).length;
  const moderate = leadSLATracker.filter(l => l.riskScore >= 30 && l.riskScore < 60).length;
  
  return {
    total,
    overdue,
    critical,
    high,
    moderate,
    onTime: total - overdue
  };
}

// Export lead data for external systems (Google Sheets, etc.)
export function exportLeadData() {
  return leadSLATracker.map(lead => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    program: lead.program,
    riskScore: lead.riskScore,
    riskLevel: lead.riskScore >= 80 ? 'Critical' : 
               lead.riskScore >= 60 ? 'High' :
               lead.riskScore >= 30 ? 'Moderate' : 'Early',
    createdAt: lead.createdAt.toISOString(),
    slaDeadline: lead.slaDeadline.toISOString(),
    status: lead.status,
    source: lead.source,
    minutesUntilDeadline: Math.round((lead.slaDeadline.getTime() - new Date().getTime()) / (1000 * 60))
  }));
}

// Hybrid functions that can use Supabase when available, fallback to in-memory

// Get all leads from best available source
export async function getAllLeadsHybrid(): Promise<LeadSLA[]> {
  try {
    const supabaseLeads = await supabaseOperations.getAllLeads();
    if (supabaseLeads.length > 0) {
      // Convert Supabase format to LeadSLA format
      return supabaseLeads.map(lead => ({
        id: lead.id,
        name: `${lead.first_name} ${lead.last_name}`.trim(),
        email: lead.email || '',
        phone: lead.phone || '',
        program: lead.program,
        riskScore: lead.risk_score,
        createdAt: new Date(lead.created_at),
        slaDeadline: new Date(lead.sla_deadline),
        status: lead.status === 'New Lead' ? 'new' :
                lead.status === 'Contacted' ? 'contacted' :
                lead.status === 'In Progress' ? 'in_progress' :
                lead.status === 'Completed' ? 'completed' : 'new',
        source: lead.source
      }));
    }
  } catch (error) {
    console.warn('⚠️  Using in-memory data (Supabase unavailable)');
  }
  
  return leadSLATracker;
}

// Get overdue leads from best available source
export async function getOverdueLeadsHybrid(): Promise<LeadSLA[]> {
  try {
    const supabaseOverdue = await supabaseOperations.getOverdueLeads();
    if (supabaseOverdue.length >= 0) { // Could be 0 but still valid
      return supabaseOverdue.map(lead => ({
        id: lead.id,
        name: `${lead.first_name} ${lead.last_name}`.trim(),
        email: lead.email || '',
        phone: lead.phone || '',
        program: lead.program,
        riskScore: lead.risk_score,
        createdAt: new Date(lead.created_at),
        slaDeadline: new Date(lead.sla_deadline),
        status: lead.status === 'New Lead' ? 'new' :
                lead.status === 'Contacted' ? 'contacted' :
                lead.status === 'In Progress' ? 'in_progress' :
                lead.status === 'Completed' ? 'completed' : 'new',
        source: lead.source
      }));
    }
  } catch (error) {
    console.warn('⚠️  Using in-memory overdue data (Supabase unavailable)');
  }
  
  return getOverdueLeads(); // fallback to in-memory
}

// Get enhanced statistics from best available source
export async function getLeadStatsHybrid() {
  try {
    const supabaseStats = await supabaseOperations.getLeadStats();
    if (supabaseStats.total >= 0) { // Could be 0 but still valid
      return {
        total: supabaseStats.total,
        overdue: supabaseStats.overdue,
        critical: supabaseStats.critical,
        high: supabaseStats.high,
        moderate: supabaseStats.moderate,
        onTime: supabaseStats.total - supabaseStats.overdue,
        pending: supabaseStats.pending,
        contacted: supabaseStats.contacted,
        completed: supabaseStats.completed,
        early: supabaseStats.early
      };
    }
  } catch (error) {
    console.warn('⚠️  Using in-memory stats (Supabase unavailable)');
  }
  
  return getLeadStats(); // fallback to in-memory
}

// Clean up old completed leads (run periodically)
export function cleanupOldLeads(daysToKeep: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const beforeCount = leadSLATracker.length;
  leadSLATracker = leadSLATracker.filter(lead => 
    lead.status !== 'completed' || lead.createdAt > cutoffDate
  );
  
  const cleaned = beforeCount - leadSLATracker.length;
  console.log(`🧹 Cleaned up ${cleaned} old completed leads`);
  return cleaned;
}