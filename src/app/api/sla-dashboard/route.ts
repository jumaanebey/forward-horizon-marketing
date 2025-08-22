import { NextRequest, NextResponse } from 'next/server';
import { getAllLeadsHybrid, getOverdueLeadsHybrid, getLeadStatsHybrid, exportLeadData } from '@/lib/lead-tracker';

// SLA Dashboard API - provides monitoring data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const view = searchParams.get('view') || 'summary';

    console.log('📊 SLA Dashboard: Fetching monitoring data...');
    
    const stats = await getLeadStatsHybrid();
    const overdueLeads = await getOverdueLeadsHybrid();
    const allLeads = await getAllLeadsHybrid();
    
    const dashboardData = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      overdueLeads: overdueLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        program: lead.program,
        riskScore: lead.riskScore,
        riskLevel: lead.riskScore >= 80 ? 'Critical' : 
                   lead.riskScore >= 60 ? 'High' :
                   lead.riskScore >= 30 ? 'Moderate' : 'Early',
        createdAt: lead.createdAt.toISOString(),
        slaDeadline: lead.slaDeadline.toISOString(),
        minutesOverdue: Math.round((new Date().getTime() - lead.slaDeadline.getTime()) / (1000 * 60)),
        status: lead.status,
        source: lead.source
      })),
      recentLeads: view === 'detailed' ? allLeads.slice(-10).map(lead => ({
        id: lead.id,
        name: lead.name,
        program: lead.program,
        riskScore: lead.riskScore,
        createdAt: lead.createdAt.toISOString(),
        slaDeadline: lead.slaDeadline.toISOString(),
        status: lead.status,
        source: lead.source
      })) : [],
      alerts: {
        criticalOverdue: overdueLeads.filter(l => l.riskScore >= 80).length,
        highOverdue: overdueLeads.filter(l => l.riskScore >= 60 && l.riskScore < 80).length,
        totalOverdue: overdueLeads.length,
        actionRequired: overdueLeads.length > 0
      }
    };

    if (format === 'csv') {
      const csvData = exportLeadData();
      const csvContent = [
        'ID,Name,Email,Phone,Program,Risk Score,Risk Level,Created,SLA Deadline,Status,Source,Minutes Until Deadline',
        ...csvData.map(lead => 
          `${lead.id},"${lead.name}","${lead.email}","${lead.phone}","${lead.program}",${lead.riskScore},"${lead.riskLevel}","${lead.createdAt}","${lead.slaDeadline}","${lead.status}","${lead.source}",${lead.minutesUntilDeadline}`
        )
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="sla-dashboard.csv"'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('❌ SLA Dashboard Error:', error);
    return NextResponse.json(
      { error: 'Dashboard data fetch failed', details: error },
      { status: 500 }
    );
  }
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