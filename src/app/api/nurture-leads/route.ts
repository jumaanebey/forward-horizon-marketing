import { NextRequest, NextResponse } from 'next/server';
import { getAllLeadsHybrid } from '@/lib/lead-tracker';
import { createNurtureSequence, sendNurtureEmail, calculateNurturePriority } from '@/lib/lead-nurturing';

// Lead Nurturing API - triggers nurturing sequences for new leads
export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Starting lead nurturing process...');
    
    const { action, leadId, templateType } = await request.json();
    
    if (action === 'send_email' && leadId && templateType) {
      // Send specific nurture email
      const allLeads = await getAllLeadsHybrid();
      const lead = allLeads.find(l => l.id === leadId);
      
      if (!lead) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }
      
      const emailSent = await sendNurtureEmail({
        id: lead.id,
        firstName: lead.name.split(' ')[0],
        lastName: lead.name.split(' ').slice(1).join(' '),
        email: lead.email,
        phone: lead.phone,
        program: lead.program,
        riskScore: lead.riskScore,
        source: lead.source,
        status: lead.status,
        createdAt: lead.createdAt
      }, templateType);
      
      if (emailSent) {
        console.log(`✅ Nurture email sent to ${lead.name}`);
        return NextResponse.json({
          success: true,
          message: `Nurture email sent to ${lead.name}`,
          leadId: lead.id,
          templateType
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }
    }
    
    // Get all recent leads (last 24 hours) for nurturing
    const allLeads = await getAllLeadsHybrid();
    const recentLeads = allLeads.filter(lead => {
      const hoursSinceCreated = (new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60);
      return hoursSinceCreated <= 24; // Last 24 hours
    });
    
    console.log(`📊 Found ${recentLeads.length} recent leads to nurture`);
    
    const nurtureResults = [];
    
    for (const lead of recentLeads) {
      try {
        // Calculate nurture priority
        const priority = calculateNurturePriority({
          id: lead.id,
          firstName: lead.name.split(' ')[0],
          lastName: lead.name.split(' ').slice(1).join(' '),
          email: lead.email,
          phone: lead.phone,
          program: lead.program,
          riskScore: lead.riskScore,
          source: lead.source,
          status: lead.status,
          createdAt: lead.createdAt
        });
        
        // Create nurture sequence
        const tasks = await createNurtureSequence({
          id: lead.id,
          firstName: lead.name.split(' ')[0],
          lastName: lead.name.split(' ').slice(1).join(' '),
          email: lead.email,
          phone: lead.phone,
          program: lead.program,
          riskScore: lead.riskScore,
          source: lead.source,
          status: lead.status,
          createdAt: lead.createdAt
        });
        
        // Send immediate email if lead is less than 1 hour old
        const minutesSinceCreated = (new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60);
        let emailSent = false;
        
        if (minutesSinceCreated <= 60) {
          emailSent = await sendNurtureEmail({
            id: lead.id,
            firstName: lead.name.split(' ')[0],
            lastName: lead.name.split(' ').slice(1).join(' '),
            email: lead.email,
            phone: lead.phone,
            program: lead.program,
            riskScore: lead.riskScore,
            source: lead.source,
            status: lead.status,
            createdAt: lead.createdAt
          }, 'immediate');
        }
        
        nurtureResults.push({
          leadId: lead.id,
          name: lead.name,
          priority: priority.priority,
          reason: priority.reason,
          nextAction: priority.nextAction,
          tasksCreated: tasks.length,
          immediateEmailSent: emailSent,
          riskScore: lead.riskScore
        });
        
      } catch (error) {
        console.error(`❌ Failed to nurture lead ${lead.id}:`, error);
        nurtureResults.push({
          leadId: lead.id,
          name: lead.name,
          error: 'Failed to create nurture sequence'
        });
      }
    }
    
    // Sort results by priority for display
    nurtureResults.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
    });
    
    return NextResponse.json({
      success: true,
      message: `Nurturing process completed for ${recentLeads.length} leads`,
      results: nurtureResults,
      summary: {
        totalLeads: recentLeads.length,
        critical: nurtureResults.filter(r => r.priority === 'critical').length,
        high: nurtureResults.filter(r => r.priority === 'high').length,
        medium: nurtureResults.filter(r => r.priority === 'medium').length,
        low: nurtureResults.filter(r => r.priority === 'low').length,
        emailsSent: nurtureResults.filter(r => r.immediateEmailSent).length
      }
    });
    
  } catch (error) {
    console.error('❌ Lead Nurturing Error:', error);
    return NextResponse.json(
      { error: 'Lead nurturing failed', details: error },
      { status: 500 }
    );
  }
}

// Get nurturing status for dashboard
export async function GET(request: NextRequest) {
  try {
    const allLeads = await getAllLeadsHybrid();
    
    // Get leads from last 7 days
    const recentLeads = allLeads.filter(lead => {
      const daysSinceCreated = (new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated <= 7;
    });
    
    const nurtureStatus = recentLeads.map(lead => {
      const priority = calculateNurturePriority({
        id: lead.id,
        firstName: lead.name.split(' ')[0],
        lastName: lead.name.split(' ').slice(1).join(' '),
        email: lead.email,
        phone: lead.phone,
        program: lead.program,
        riskScore: lead.riskScore,
        source: lead.source,
        status: lead.status,
        createdAt: lead.createdAt
      });
      
      return {
        id: lead.id,
        name: lead.name,
        program: lead.program,
        riskScore: lead.riskScore,
        priority: priority.priority,
        nextAction: priority.nextAction,
        createdAt: lead.createdAt.toISOString(),
        hoursSinceCreated: Math.round((new Date().getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60))
      };
    });
    
    return NextResponse.json({
      success: true,
      leads: nurtureStatus.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      }),
      summary: {
        total: recentLeads.length,
        needingAttention: nurtureStatus.filter(l => 
          l.priority === 'critical' || 
          (l.priority === 'high' && l.hoursSinceCreated > 2) ||
          (l.priority === 'medium' && l.hoursSinceCreated > 4)
        ).length
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting nurture status:', error);
    return NextResponse.json(
      { error: 'Failed to get nurture status' },
      { status: 500 }
    );
  }
}