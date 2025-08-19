import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return demo data when database is not configured
    const demoLeads = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '555-0123',
        inquiry_type: 'veterans',
        message: 'Interested in veteran housing',
        created_at: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '2', 
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '555-0456',
        inquiry_type: 'recovery',
        message: 'Looking for recovery housing',
        created_at: new Date().toISOString(),
        status: 'new'
      }
    ];

    return NextResponse.json({
      success: true,
      leads: demoLeads,
      count: demoLeads.length,
      message: 'Demo leads - database not configured'
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      leads: []
    }, { status: 500 });
  }
}