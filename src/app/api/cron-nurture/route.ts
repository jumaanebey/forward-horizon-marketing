import { NextRequest, NextResponse } from 'next/server';
import { getAllLeadsHybrid, getOverdueLeadsHybrid } from '@/lib/lead-tracker';
import { sendNurtureEmail, calculateNurturePriority } from '@/lib/lead-nurturing';

function verifyCron(req: NextRequest) {
  const token = req.headers.get('x-cron-secret');
  return !!process.env.CRON_SHARED_SECRET && token === process.env.CRON_SHARED_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allLeads = await getAllLeadsHybrid();
  const recentLeads = allLeads.filter(l => (Date.now() - l.createdAt.getTime()) <= 24 * 60 * 60 * 1000);

  let emailsSent = 0;
  for (const lead of recentLeads) {
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

    if (priority.priority === 'critical' || priority.priority === 'high') {
      const sent = await sendNurtureEmail({
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
      }, 'followUp24hr');
      if (sent) emailsSent++;
    }
  }

  const overdue = await getOverdueLeadsHybrid();

  return NextResponse.json({ ok: true, processed: recentLeads.length, emailsSent, overdue: overdue.length });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-cron-secret',
    },
  });
}