// Simple lead tracking system that works with existing Google Sheets integration
// This bridges the gap until full Supabase implementation

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

// Add lead to SLA tracking
export function trackLeadSLA(lead: {
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
  
  leadSLATracker.push(leadSLA);
  
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

// Update lead status
export function updateLeadStatus(leadId: string, status: LeadSLA['status']) {
  const lead = leadSLATracker.find(l => l.id === leadId);
  if (lead) {
    lead.status = status;
    console.log(`📊 Lead status updated: ${leadId} -> ${status}`);
    return true;
  }
  return false;
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