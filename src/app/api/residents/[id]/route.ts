import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    resident: null,
    message: 'Resident details - Demo mode'
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    message: 'Resident update not configured',
    success: false
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    message: 'Resident deletion not configured', 
    success: false
  });
}