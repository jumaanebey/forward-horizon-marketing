import { NextRequest, NextResponse } from 'next/server';

// GET /api/email-sequences - Get email sequence statistics  
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'process') {
      // Return demo processing result
      return NextResponse.json({
        message: 'Email sequences processed (demo mode)',
        processed: 0,
        results: []
      });
    } else {
      // Return demo statistics
      return NextResponse.json({
        statistics: {
          totalLeads: 0,
          byInquiryType: {},
          bySequenceStep: {},
          readyForNextStep: 0
        },
        sequences: ['veterans', 'recovery', 'reentry']
      });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/email-sequences - Send manual email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, customMessage, subject } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Return demo success response
    return NextResponse.json({
      message: 'Email would be sent (demo mode)',
      leadId,
      email: 'demo@example.com'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}