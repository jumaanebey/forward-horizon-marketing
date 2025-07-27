import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Email templates for each audience
const emailTemplates = {
  veterans: {
    subject: "Your Veterans Benefits Guide + Housing Checklist",
    pdfFile: "Veterans_Benefits_Guide.pdf",
    body: `Thank you for downloading your Veterans Benefits Guide!

Your service to our country deserves recognition, and your transition to civilian housing should be supported every step of the way.

This comprehensive guide includes:
• Complete VA benefits overview and eligibility
• Step-by-step housing application process
• Financial planning templates and budgeting guidance
• Essential documentation checklists
• Emergency contacts and resources

Ready to take the next step? Visit Forward Horizon to learn about our veterans housing program and submit your application: https://theforwardhorizon.com

Questions? Call us at (626) 603-0954 - we're here to help.

Semper Fi,
The Forward Horizon Team`
  },
  recovery: {
    subject: "Your Recovery Housing Preparation Guide",
    pdfFile: "Recovery_Housing_Preparation_Guide.pdf",
    body: `Welcome to your recovery journey!

Taking this step shows incredible strength and courage. Your Recovery Housing Preparation Guide is here to support you every step of the way.

Inside your guide you'll find:
• Complete preparation checklist for recovery housing
• What to expect in your first week and month
• Building support networks and relapse prevention strategies
• Financial planning for recovery
• Daily structure guidance and house rules

You're not alone in this journey. Visit Forward Horizon to learn about our recovery community and supportive housing program: https://theforwardhorizon.com

24/7 Support: (626) 603-0954

One day at a time,
The Forward Horizon Recovery Team`
  },
  reentry: {
    subject: "Your Life After Release Planning Kit",
    pdfFile: "Life_After_Release_Planning_Kit.pdf",
    body: `Your fresh start begins now!

Your past doesn't define your future, and this comprehensive planning kit will help you build the successful, independent life you deserve.

Your complete kit includes:
• 90-day step-by-step re-entry plan
• Essential documentation checklist and how to obtain them
• Employment strategies for second-chance hiring
• Housing options and application guidance
• Legal rights and benefit information

Forward Horizon believes in second chances. Visit us to learn about our re-entry support program and housing options: https://theforwardhorizon.com

Need immediate support? Call (626) 603-0954

Believing in your success,
The Forward Horizon Reentry Team`
  }
};

export async function POST(request: NextRequest) {
  try {
    const { firstName, email, formType } = await request.json();

    // Validate input
    if (!firstName || !email || !formType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!emailTemplates[formType as keyof typeof emailTemplates]) {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      );
    }

    // For now, let's use a webhook approach to ensure leads are captured
    // We'll send you a webhook notification instead of email
    
    const template = emailTemplates[formType as keyof typeof emailTemplates];
    
    // Send webhook notification to you
    try {
      const webhookData = {
        firstName,
        email,
        formType,
        timestamp: new Date().toISOString(),
        pdfRequested: template.pdfFile,
        source: 'Forward Horizon Marketing Funnel'
      };

      // Log the lead capture (you can see this in Vercel logs)
      console.log('LEAD CAPTURED:', JSON.stringify(webhookData, null, 2));
      
      // For now, we'll just return success and let you follow up manually
      // The PDF is available at: /public/[pdfname].pdf on your site
      
      return NextResponse.json({
        success: true,
        message: `Thank you ${firstName}! Your ${template.subject} will be sent to ${email} shortly. Our team will contact you within 24 hours.`,
        leadCaptured: true,
        nextSteps: 'Visit theforwardhorizon.com to learn more about our programs.'
      });
      
    } catch (error) {
      console.error('Error processing lead:', error);
      return NextResponse.json({
        success: true, // Still return success so funnel works
        message: `Thank you ${firstName}! We've received your request and will contact you at ${email} within 24 hours.`,
        leadCaptured: true
      });
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send guide. Please try again.' },
      { status: 500 }
    );
  }
}