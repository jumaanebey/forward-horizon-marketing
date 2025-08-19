import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    residents: [],
    message: 'Residents API - Demo mode'
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Resident creation not configured',
    success: false
  });
}