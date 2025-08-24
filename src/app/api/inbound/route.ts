import { NextRequest, NextResponse } from 'next/server';
import { supabaseLookup, supabaseOperations } from '@/lib/supabase';

// Simple shared-secret header verification
function verifySecret(req: NextRequest): boolean {
  const provided = req.headers.get('x-webhook-secret');
  const expected = process.env.WEBHOOK_SHARED_SECRET;
  return Boolean(expected && provided && provided === expected);
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const channel = (body.channel || '').toLowerCase(); // 'sms' | 'email'
  const from = String(body.from || '');
  const content = String(body.content || '').trim();

  if (!channel || !from || !content) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Normalize and lookup
  let lead: any = null;
  if (channel === 'email') {
    lead = await supabaseLookup.byEmail(from);
  } else if (channel === 'sms') {
    // Try to match by phone digits
    const digits = from.replace(/\D/g, '');
    lead = await supabaseLookup.byPhone(digits);
  }

  if (!lead) {
    return NextResponse.json({ ok: true, message: 'No matching lead' });
  }

  // Basic STOP/UNSUBSCRIBE handling
  const lower = content.toLowerCase();
  if (['stop', 'unsubscribe', 'cancel'].includes(lower)) {
    await supabaseOperations.updateLeadStatus(lead.id, 'Closed', 'Unsubscribed via inbound');
    return NextResponse.json({ ok: true, action: 'unsubscribed', leadId: lead.id });
  }

  // Simple engagement intent
  if (['yes', 'book', 'schedule'].includes(lower)) {
    await supabaseOperations.updateLeadStatus(lead.id, 'Contacted', 'Lead engaged via inbound');
    return NextResponse.json({ ok: true, action: 'engaged', leadId: lead.id });
  }

  return NextResponse.json({ ok: true, leadId: lead.id });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-webhook-secret',
    },
  });
}