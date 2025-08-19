import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json({
        success: true,
        leads: [],
        count: 0,
        message: 'Database not configured - using demo mode'
      });
    }

    // Get all leads from Supabase
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Limit to last 100 leads

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        leads: []
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      leads: leads || [],
      count: leads?.length || 0,
      message: 'Leads fetched successfully'
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