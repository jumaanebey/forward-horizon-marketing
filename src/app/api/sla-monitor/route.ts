import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SLA Monitor API - called by Vercel Cron or external scheduler
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 SLA Monitor: Checking overdue leads...');
    
    // Get current time for SLA calculations
    const now = new Date();
    const overdueLeads = await checkOverdueLeads(now);
    
    let alertsSent = 0;
    
    for (const lead of overdueLeads) {
      await sendEscalationAlert(lead);
      alertsSent++;
    }
    
    console.log(`📧 SLA Monitor: Sent ${alertsSent} escalation alerts`);
    
    return NextResponse.json({
      success: true,
      message: `SLA check completed. ${alertsSent} escalation alerts sent.`,
      overdueCount: overdueLeads.length,
      timestamp: now.toISOString()
    });
    
  } catch (error) {
    console.error('❌ SLA Monitor Error:', error);
    return NextResponse.json(
      { error: 'SLA monitoring failed', details: error },
      { status: 500 }
    );
  }
}

// Calculate SLA deadline based on risk score
function calculateSLADeadline(riskScore: number, createdAt: Date): Date {
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

// Check for overdue leads (simulated - in production would query database)
async function checkOverdueLeads(currentTime: Date) {
  // TODO: Replace with actual database query when Supabase is implemented
  // For now, we'll simulate checking Google Sheets or create a simple lead tracking system
  
  // This is a placeholder that demonstrates the logic
  // In production, this would query your database for leads where:
  // - status = 'new' or 'pending'
  // - sla_deadline < currentTime
  
  const simulatedOverdueLeads = [
    // This would be replaced with real database query results
  ];
  
  return simulatedOverdueLeads;
}

// Send escalation alert to team
async function sendEscalationAlert(lead: any) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured - would send escalation alert for lead:', lead.id);
    return;
  }

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const riskLevel = lead.riskScore >= 80 ? 'CRITICAL' : 
                   lead.riskScore >= 60 ? 'HIGH' : 
                   lead.riskScore >= 30 ? 'MODERATE' : 'EARLY';

  const timeOverdue = Math.round((new Date().getTime() - new Date(lead.slaDeadline).getTime()) / (1000 * 60));

  const escalationEmail = {
    from: process.env.EMAIL_USER,
    to: 'theforwardhorizon@gmail.com',
    cc: 'alerts@theforwardhorizon.com', // Optional escalation address
    subject: `🚨 SLA MISSED - ${riskLevel} Priority Lead - ${lead.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚨 SLA VIOLATION</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Response time exceeded for ${riskLevel} priority lead</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #dc2626; margin-top: 0;">Lead Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Program:</td>
              <td style="padding: 8px 0;">${lead.program}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Risk Level:</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${riskLevel} (${lead.riskScore} points)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Time Overdue:</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${timeOverdue} minutes</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
              <td style="padding: 8px 0;">${new Date(lead.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Required Action</h3>
            <p style="margin-bottom: 0;">Contact this lead immediately. ${riskLevel} priority requires immediate response.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="tel:${lead.phone}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">📞 Call ${lead.name}</a>
            <a href="mailto:${lead.email}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">✉️ Email</a>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://google-ads-landing-page-chi.vercel.app/dashboard" style="color: #6b7280; text-decoration: none;">View Full Dashboard →</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>Forward Horizon SLA Monitoring System</p>
          <p>This alert was generated automatically. Reply to this email for support.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(escalationEmail);
  console.log(`📧 Escalation alert sent for lead: ${lead.id}`);
}

// Helper function to get SLA requirements text
function getSLARequirement(riskScore: number): string {
  if (riskScore >= 80) return '15 minutes';
  if (riskScore >= 60) return '2 hours';
  if (riskScore >= 30) return '24 hours';
  return '3 days';
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}