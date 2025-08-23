import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { trackLeadSLA, calculateSLADeadline } from '@/lib/lead-tracker';
import { saveLeadToSupabase } from '@/lib/supabase-lead-tracker';
import { Analytics } from '@/lib/analytics-tracker';
import crypto from 'crypto';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Email templates for each audience
const emailTemplates = {
  general: {
    subject: "Thank you for contacting Forward Horizon",
    pdfFile: null, // NO ATTACHMENT for general inquiries
    body: `Thank you for contacting Forward Horizon!

We received your message and will respond within 24 hours during business days.

Forward Horizon provides transitional housing for veterans, individuals in recovery, and returning citizens. We're here to help you on your journey.

Visit our website: https://theforwardhorizon.com
Call us: (310) 488-5280

Best regards,
The Forward Horizon Team`
  },
  veterans: {
    subject: "🇺🇸 Your Veterans Benefits Guide + Housing Checklist",
    pdfFile: "Veterans_Benefits_Guide.pdf",
    body: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Veterans Benefits Guide</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🇺🇸</div>
                            <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold;">Thank You for Your Service!</h1>
                            <p style="color: #bfdbfe; font-size: 16px; margin: 16px 0 0 0;">Your Veterans Benefits Guide is ready</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0; line-height: 1.6;">
                                Dear Veteran,
                            </p>
                            
                            <p style="font-size: 16px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.6;">
                                Your service to our country deserves recognition, and your transition to civilian housing should be supported every step of the way.
                            </p>
                            
                            <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin: 24px 0;">
                                <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 16px 0;">Your comprehensive guide includes:</h3>
                                <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                                    <li>Complete VA benefits overview and eligibility</li>
                                    <li>Step-by-step housing application process</li>
                                    <li>Financial planning templates and budgeting guidance</li>
                                    <li>Essential documentation checklists</li>
                                    <li>Emergency contacts and resources</li>
                                </ul>
                            </div>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://theforwardhorizon.com" style="background-color: #1e40af; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Learn About Veterans Housing</a>
                            </div>
                            
                            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
                                <h4 style="color: #1e40af; margin: 0 0 12px 0;">Need to speak with someone?</h4>
                                <p style="color: #1e40af; margin: 0; font-weight: bold;">📞 (310) 488-5280</p>
                                <p style="color: #3b82f6; margin: 8px 0 0 0; font-size: 14px;">Available 24/7 for veteran crisis support</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #1e40af; font-weight: bold; margin: 0 0 8px 0; font-size: 18px;">Semper Fi,</p>
                            <p style="color: #6b7280; margin: 0 0 16px 0;">The Forward Horizon Veterans Team</p>
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
                                <p style="color: #9ca3af; font-size: 14px; margin: 0;">Forward Horizon - Serving Those Who Served</p>
                                <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;">Los Angeles County, Orange County, Riverside County & San Bernardino County</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    htmlBody: true
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

24/7 Support: (310) 488-5280

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

Need immediate support? Call (310) 488-5280

Believing in your success,
The Forward Horizon Reentry Team`
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('API route called! - v3.0 - LATEST VERSION');
    
    // Handle both JSON and form data
    let firstName, lastName, email, phone, message, formType, urgency, currentSituation, supportNeeded;
    
    const contentType = request.headers.get('content-type');
    console.log('Content type:', contentType);
    
    if (contentType?.includes('application/json')) {
      const data = await request.json();
      firstName = data.firstName;
      lastName = data.lastName;
      email = data.email;
      phone = data.phone;
      message = data.message;
      formType = data.formType;
      urgency = data.urgency;
      currentSituation = data.current_situation;
      supportNeeded = data.support_needed;
    } else {
      // Handle form data
      const formData = await request.formData();
      firstName = formData.get('firstName')?.toString();
      lastName = formData.get('lastName')?.toString();
      email = formData.get('email')?.toString();
      phone = formData.get('phone')?.toString();
      message = formData.get('message')?.toString();
      formType = formData.get('inquiry_type')?.toString();
      urgency = formData.get('urgency')?.toString();
      currentSituation = formData.get('current_situation')?.toString();
      supportNeeded = formData.get('support_needed')?.toString();
      
      // Check if this is a redirect request (fallback form submission)
      const isRedirect = formData.get('redirect');
      if (isRedirect) {
        console.log('Redirect form submission detected');
        // Handle redirect after processing
        const templateKey = formTypeMapping[formType || ''] || 'general';
        
        // Process the form but redirect instead of returning JSON
        try {
          // Quick email processing without full validation
          console.log(`Redirect lead captured: ${firstName} (${email}) - ${formType}`);
          
          // Redirect to thank you page
          const redirectUrl = `https://app.theforwardhorizon.com/thank-you?type=${formType}&name=${firstName}`;
          return NextResponse.redirect(redirectUrl);
        } catch (error) {
          console.error('Error in redirect processing:', error);
          return NextResponse.redirect('https://app.theforwardhorizon.com/thank-you?type=general');
        }
      }
    }
    
    console.log('Received data:', { firstName, email, formType });

    // Validate input
    if (!firstName || !email) {
      console.log('Missing required fields:', { firstName, email, formType });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Set default formType if missing
    if (!formType) {
      formType = 'general';
      console.log('No formType provided, using default:', formType);
    }

    // Map form values to template keys
    const formTypeMapping: { [key: string]: string } = {
      'veteran-housing': 'veterans',
      'sober-living': 'recovery', 
      'Re-Entry-housing': 'reentry',
      'volunteer': 'general',
      'donate': 'general',
      'partner': 'general',
      'other': 'general'
    };

    let templateKey = formTypeMapping[formType] || formType;
    console.log('FormType mapping:', formType, '->', templateKey);

    if (!emailTemplates[templateKey as keyof typeof emailTemplates]) {
      console.log('Template not found for key:', templateKey);
      console.log('Available templates:', Object.keys(emailTemplates));
      // Fallback to general template
      templateKey = 'general';
      console.log('Using fallback template:', templateKey);
    }

    // Get email template
    const template = emailTemplates[templateKey as keyof typeof emailTemplates];

    // Log the lead capture (for now, until email is configured)
    console.log(`Lead captured: ${firstName} (${email}) - ${formType}`);
    console.log('Email template would be:', template.subject);

    // Debug logging
    console.log('Form submission received:');
    console.log('firstName:', firstName);
    console.log('email:', email);
    console.log('formType:', formType);
    console.log('EMAIL_USER configured:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS configured:', !!process.env.EMAIL_PASS);

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured - redirecting to success page anyway');
      
      const redirectUrl = `https://app.theforwardhorizon.com/thank-you?type=${formType}&name=${encodeURIComponent(firstName)}`;
      
      const htmlRedirect = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta http-equiv="refresh" content="0; url=${redirectUrl}">
          <script>window.location.href = "${redirectUrl}";</script>
      </head>
      <body>
          <p>Redirecting to success page...</p>
          <p>If you are not redirected, <a href="${redirectUrl}">click here</a>.</p>
      </body>
      </html>`;
      
      return new NextResponse(htmlRedirect, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // Create transporter (using Gmail SMTP for demo - in production use service like SendGrid)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password, not regular password
      },
    });

    // Get PDF file path
    const pdfPath = path.join(process.cwd(), template.pdfFile);
    
    // Check if PDF exists
    let pdfExists = false;
    try {
      pdfExists = fs.existsSync(pdfPath);
    } catch (error) {
      console.log('PDF check failed:', error);
    }
    
    if (!pdfExists) {
      console.log(`PDF not found: ${pdfPath} - sending email without attachment`);
    }

    // Personalize email body
    const personalizedBody = template.body.replace(/\{firstName\}/g, firstName);

    // Email options
    const mailOptions: any = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
    };

    // Use HTML if available, otherwise plain text
    if (template.htmlBody) {
      mailOptions.html = template.body.replace(/\{firstName\}/g, firstName);
      console.log('Using HTML email template');
    } else {
      mailOptions.text = personalizedBody + '\n\nNote: Your guide will be sent in a separate email with the PDF attachment.';
      console.log('Using plain text email template');
    }

    // Add PDF attachment if it exists
    if (pdfExists) {
      mailOptions.attachments = [
        {
          filename: template.pdfFile,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ];
      console.log('PDF attachment added');
    } else {
      console.log('Sending email without PDF attachment');
    }

    // Send email to user only (no spam)
    await transporter.sendMail(mailOptions);
    console.log(`Professional email sent to: ${email}`);

    // Log lead for manual follow-up (no additional emails for now)
    console.log(`✅ LEAD CAPTURED: ${firstName} (${email}) - ${formType} program`);

    // Send lead to Google Sheets and Dashboard system
    try {
      // Calculate risk level based on user responses
      let riskLevel = 'early';
      let priorityScore = 30;

      // Start with base program type scoring
      let programScore = 0;
      if (formType === 'veteran-housing' || formType === 'veterans') {
        programScore = 20;
      } else if (formType === 'sober-living' || formType === 'recovery') {
        programScore = 25;
      } else if (formType === 'Re-entry-housing' || formType === 'reentry') {
        programScore = 15;
      } else {
        programScore = 5; // Other inquiries
      }

      // Add urgency scoring
      let urgencyScore = 0;
      if (urgency === 'immediate') {
        urgencyScore = 50; // Critical
      } else if (urgency === 'within-week') {
        urgencyScore = 35; // High
      } else if (urgency === 'within-month') {
        urgencyScore = 20; // Moderate
      } else if (urgency === 'future-planning') {
        urgencyScore = 5; // Early/Planning
      } else if (urgency === 'not-applicable') {
        urgencyScore = 0; // Not seeking housing
      }

      // Add current situation scoring
      let situationScore = 0;
      if (currentSituation === 'crisis') {
        situationScore = 30; // Crisis situation
      } else if (currentSituation === 'transitioning') {
        situationScore = 25; // Transitioning out
      } else if (currentSituation === 'unstable') {
        situationScore = 15; // Unstable housing
      } else if (currentSituation === 'stable-planning') {
        situationScore = 5; // Stable but planning
      } else if (currentSituation === 'other-support') {
        situationScore = 0; // Other support needs
      }

      // Add support needed scoring
      let supportScore = 0;
      if (supportNeeded === 'emergency-housing') {
        supportScore = 20; // Emergency need
      } else if (supportNeeded === 'program-entry') {
        supportScore = 15; // Program entry help
      } else if (supportNeeded === 'information') {
        supportScore = 5; // Information seeking
      } else if (supportNeeded === 'application-help') {
        supportScore = 10; // Application help
      } else if (supportNeeded === 'other-services') {
        supportScore = 8; // Other services
      } else if (supportNeeded === 'giving-back') {
        supportScore = 0; // Volunteering/donating
      }

      // Calculate total priority score
      priorityScore = programScore + urgencyScore + situationScore + supportScore;

      // Determine risk level based on total score
      if (priorityScore >= 80) {
        riskLevel = 'critical';
      } else if (priorityScore >= 60) {
        riskLevel = 'high';
      } else if (priorityScore >= 30) {
        riskLevel = 'moderate';
      } else {
        riskLevel = 'early';
      }

      console.log(`Risk Assessment: Program(${programScore}) + Urgency(${urgencyScore}) + Situation(${situationScore}) + Support(${supportScore}) = ${priorityScore} (${riskLevel})`);
    
      // Generate unique lead ID
      const leadId = crypto.randomUUID();
      
      // Track form submission analytics
      Analytics.trackFormSubmit(formType, leadId, priorityScore, formType);
      
      // Add to SLA tracking system (dual storage)
      const slaDeadline = calculateSLADeadline(priorityScore);
      const leadSLA = trackLeadSLA({
        id: leadId,
        firstName: firstName,
        lastName: '', // We don't capture lastName in current form
        email: email,
        phone: '', // We don't capture phone in current form
        program: formType,
        riskScore: priorityScore,
        source: 'Main Website - theforwardhorizon.com'
      });
      
      // DUAL STORAGE: Save to both Supabase and in-memory tracker
      const supabaseLead = await saveLeadToSupabase({
        id: leadId,
        firstName: firstName,
        lastName: '',
        email: email,
        phone: '',
        program: formType,
        riskScore: priorityScore,
        source: 'Main Website - theforwardhorizon.com'
      });
      
      if (supabaseLead) {
        console.log(`💾 Lead saved to Supabase: ${leadId}`);
      } else {
        console.log(`⚠️ Lead saved to memory tracker only: ${leadId}`);
      }
      
      console.log(`📊 SLA Tracking: Lead ${leadId} must be contacted by ${slaDeadline.toLocaleString()}`);

      const leadData = {
        id: leadId,
        timestamp: new Date().toISOString(),
        firstName: firstName,
        lastName: '', // We don't capture lastName in current form
        email: email,
        phone: '', // We don't capture phone in current form  
        program: formType,
        message: `Contact form submission from theforwardhorizon.com - ${formType} inquiry`,
        riskLevel: riskLevel,
        priorityScore: priorityScore,
        slaDeadline: slaDeadline.toISOString(),
        source: 'Main Website - theforwardhorizon.com'
      };

      // Send to Google Sheets (same system as Google Ads landing page)
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwGP0bSFfhE0-w4RwrBFFDBZViBgu0ut5YKz129QM-3N-zMXbTUhv_mVoolzl9YQEmRWQ/exec';
      
      if (GOOGLE_SHEET_URL) {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        });
        console.log('✅ Lead sent to Google Sheets dashboard system');
        
        // Track conversion analytics
        Analytics.trackConversion(leadId, formType, priorityScore);
      }

      // Send notification email to Forward Horizon team
      try {
        const notificationEmail = {
          from: process.env.EMAIL_USER,
          to: 'theforwardhorizon@gmail.com',
          subject: `🚨 NEW ${riskLevel.toUpperCase()} PRIORITY LEAD from theforwardhorizon.com - ${firstName}`,
          text: `
NEW LEAD from theforwardhorizon.com:

Lead ID: ${leadId}
Name: ${firstName}
Email: ${email}
Program: ${formType}
Risk Level: ${riskLevel.toUpperCase()}
Priority Score: ${priorityScore}/100

SLA DEADLINE: ${slaDeadline.toLocaleString()}
Response Required: ${riskLevel === 'critical' ? '15 minutes' : riskLevel === 'high' ? '2 hours' : riskLevel === 'moderate' ? '24 hours' : '3 days'}

URGENCY FACTORS:
- When needed: ${urgency || 'Not specified'}
- Current situation: ${currentSituation || 'Not specified'}
- Support needed: ${supportNeeded || 'Not specified'}

Dashboard: https://google-ads-landing-page-chi.vercel.app/dashboard/login

Contact Info:
Email: ${email}
Phone: Not captured from main site form

Source: theforwardhorizon.com contact form
Timestamp: ${new Date().toLocaleString()}
          `
        };

        await transporter.sendMail(notificationEmail);
        console.log('✅ Notification email sent to theforwardhorizon@gmail.com');
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }

      console.log(`📊 Lead added to dashboard: ${firstName} (${email}) - ${formType} - Risk: ${riskLevel}`);
      
    } catch (error) {
      console.error('Error sending lead to dashboard system:', error);
      // Don't fail the form submission if dashboard integration fails
    }
    
    console.log('🚀 About to redirect to success page...');

    // Always redirect to success page for better UX
    const redirectUrl = `https://app.theforwardhorizon.com/thank-you?type=${formType}&name=${encodeURIComponent(firstName)}`;
    
    // Log success for debugging
    console.log('Form processed successfully, redirecting to:', redirectUrl);
    
    // Try HTML redirect instead of server redirect
    const htmlRedirect = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <script>window.location.href = "${redirectUrl}";</script>
    </head>
    <body>
        <p>Redirecting to success page...</p>
        <p>If you are not redirected, <a href="${redirectUrl}">click here</a>.</p>
    </body>
    </html>`;
    
    return new NextResponse(htmlRedirect, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to send guide. Please try again.' },
      { status: 500 }
    );

    // Add CORS headers to error response
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}