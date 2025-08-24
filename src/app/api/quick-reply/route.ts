import { NextRequest, NextResponse } from 'next/server';
import { supabaseOperations, supabaseLookup } from '@/lib/supabase';

function ok(req: NextRequest) {
  const token = req.headers.get('x-quick-secret');
  return !!process.env.QUICK_REPLY_SECRET && token === process.env.QUICK_REPLY_SECRET;
}

export async function POST(req: NextRequest) {
  if (!ok(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { email, phone, action } = await req.json();
  if (!email && !phone) return NextResponse.json({ error: 'Missing sender' }, { status: 400 });

  const lead = email ? await supabaseLookup.byEmail(email) : await supabaseLookup.byPhone(String(phone || ''));
  if (!lead) return NextResponse.json({ ok: true, message: 'No matching lead' });

  if ((action || '').toLowerCase() === 'stop') {
    await supabaseOperations.updateLeadStatus(lead.id, 'Closed', 'Quick reply STOP');
    return NextResponse.json({ ok: true, action: 'unsubscribed', leadId: lead.id });
  }

  await supabaseOperations.updateLeadStatus(lead.id, 'Contacted', 'Quick reply engaged');
  return NextResponse.json({ ok: true, action: 'engaged', leadId: lead.id });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-quick-secret',
    },
  });
}