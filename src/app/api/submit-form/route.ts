import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { supabase } from '../../../lib/supabase';

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

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const template = emailTemplates[formType as keyof typeof emailTemplates];
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // Save lead to database first
      const leadData = {
        first_name: firstName,
        email: email,
        form_type: formType,
        source: 'marketing_funnel',
        status: 'new',
        lead_value: 25.00,
        pdf_delivered: false, // Will update after successful email
        email_sequence_step: 0,
        utm_source: request.headers.get('referer'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      }

      const { data: savedLead, error: leadError } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (leadError) {
        console.error('Error saving lead:', leadError)
        // Continue with email even if database save fails
      }

      // Get PDF file
      const pdfPath = path.join(process.cwd(), 'public', template.pdfFile);
      
      if (!fs.existsSync(pdfPath)) {
        console.error(`PDF not found: ${pdfPath}`);
        return NextResponse.json(
          { error: 'Resource temporarily unavailable' },
          { status: 500 }
        );
      }

      const pdfBuffer = fs.readFileSync(pdfPath);
      const personalizedBody = template.body.replace(/\{firstName\}/g, firstName);

      // Send email to user with PDF
      await resend.emails.send({
        from: 'Forward Horizon <noreply@resend.dev>', // Temporary from address
        to: email,
        subject: template.subject,
        text: personalizedBody,
        attachments: [
          {
            filename: template.pdfFile,
            content: pdfBuffer,
          },
        ],
      });

      // Send notification to you
      await resend.emails.send({
        from: 'Forward Horizon <noreply@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL || 'admin@theforwardhorizon.com',
        subject: `New Lead: ${formType} form submission`,
        text: `New lead captured:

Name: ${firstName}
Email: ${email}
Form Type: ${formType}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Follow up with this lead within 24 hours for best conversion rates.

Forward Horizon Team`,
      });

      // Update lead to mark PDF as delivered
      if (savedLead) {
        await supabase
          .from('leads')
          .update({ pdf_delivered: true })
          .eq('id', savedLead.id)
      }

      console.log(`Lead captured and emails sent: ${firstName} (${email}) - ${formType}`);

      return NextResponse.json({
        success: true,
        message: 'Guide sent successfully! Check your email.',
        emailSequenceStarted: true,
        leadId: savedLead?.id
      });

    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send guide. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send guide. Please try again.' },
      { status: 500 }
    );
  }
}