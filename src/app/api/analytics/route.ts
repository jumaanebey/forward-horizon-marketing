import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    analytics: {
      leads: 0,
      conversions: 0,
      campaigns: 0
    },
    message: 'Analytics API - Demo mode'
  });
}