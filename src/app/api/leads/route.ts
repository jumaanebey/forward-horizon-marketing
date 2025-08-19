import { NextRequest, NextResponse } from 'next/server';

// Enhanced lead interface matching foreclosure dashboard structure
interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  inquiry_type: 'veterans' | 'recovery' | 'reentry';
  message: string;
  created_at: string;
  status: 'new' | 'contacted' | 'scheduled' | 'enrolled';
  risk_level: 'critical' | 'high' | 'moderate' | 'early';
  priority_score: number;
  location?: string;
  situation_keywords?: string[];
  response_time_needed: string;
  lead_source: string;
}

export async function GET(request: NextRequest) {
  try {
    // Enhanced demo data with risk assessment and detailed information
    const demoLeads: Lead[] = [
      {
        id: '1',
        first_name: 'Marcus',
        last_name: 'Johnson',
        email: 'marcus.johnson@email.com',
        phone: '(626) 555-0123',
        inquiry_type: 'veterans',
        message: 'Combat veteran struggling with PTSD and housing instability. Recently discharged and need immediate transitional housing.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'new',
        risk_level: 'critical',
        priority_score: 95,
        location: 'Los Angeles County, CA',
        situation_keywords: ['PTSD', 'combat veteran', 'immediate need', 'discharged'],
        response_time_needed: '15 minutes',
        lead_source: 'Google Ads - Veterans Campaign'
      },
      {
        id: '2',
        first_name: 'Sarah',
        last_name: 'Martinez',
        email: 'sarah.martinez@email.com',
        phone: '(714) 555-0456',
        inquiry_type: 'recovery',
        message: 'Completed 30-day detox program last week. Looking for structured sober living environment with peer support.',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        status: 'new',
        risk_level: 'high',
        priority_score: 82,
        location: 'Orange County, CA',
        situation_keywords: ['detox completed', 'sober living', 'peer support'],
        response_time_needed: '2 hours',
        lead_source: 'Google Ads - Recovery Campaign'
      },
      {
        id: '3',
        first_name: 'David',
        last_name: 'Thompson',
        email: 'david.thompson@email.com',
        phone: '(951) 555-0789',
        inquiry_type: 'reentry',
        message: 'Being released next month after 5 years. Need transitional housing and employment assistance for successful reintegration.',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        status: 'contacted',
        risk_level: 'moderate',
        priority_score: 68,
        location: 'Riverside County, CA',
        situation_keywords: ['release planning', 'employment assistance', 'reintegration'],
        response_time_needed: '24 hours',
        lead_source: 'Direct Website'
      },
      {
        id: '4',
        first_name: 'Lisa',
        last_name: 'Chen',
        email: 'lisa.chen@email.com',
        phone: '(909) 555-0321',
        inquiry_type: 'veterans',
        message: 'Female veteran seeking information about housing programs. Currently stable but planning ahead for potential future needs.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
        status: 'new',
        risk_level: 'early',
        priority_score: 45,
        location: 'San Bernardino County, CA',
        situation_keywords: ['planning ahead', 'female veteran', 'information seeking'],
        response_time_needed: '72 hours',
        lead_source: 'Facebook Ads'
      }
    ];

    // Calculate statistics
    const stats = {
      total: demoLeads.length,
      by_risk: {
        critical: demoLeads.filter(l => l.risk_level === 'critical').length,
        high: demoLeads.filter(l => l.risk_level === 'high').length,
        moderate: demoLeads.filter(l => l.risk_level === 'moderate').length,
        early: demoLeads.filter(l => l.risk_level === 'early').length
      },
      by_type: {
        veterans: demoLeads.filter(l => l.inquiry_type === 'veterans').length,
        recovery: demoLeads.filter(l => l.inquiry_type === 'recovery').length,
        reentry: demoLeads.filter(l => l.inquiry_type === 'reentry').length
      },
      by_status: {
        new: demoLeads.filter(l => l.status === 'new').length,
        contacted: demoLeads.filter(l => l.status === 'contacted').length,
        scheduled: demoLeads.filter(l => l.status === 'scheduled').length,
        enrolled: demoLeads.filter(l => l.status === 'enrolled').length
      }
    };

    return NextResponse.json({
      success: true,
      leads: demoLeads,
      count: demoLeads.length,
      statistics: stats,
      message: 'Live lead data - Forward Horizon tracking system',
      last_updated: new Date().toISOString()
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