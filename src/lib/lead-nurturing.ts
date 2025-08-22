// Lead Nurturing System for Forward Horizon
// Automated follow-up sequences and task management

import { supabaseOperations } from './supabase';
import nodemailer from 'nodemailer';

export interface NurtureTask {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'text' | 'meeting' | 'document';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'skipped';
  scheduledFor: Date;
  title: string;
  description: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
  riskScore: number;
  source: string;
  status: string;
  createdAt: Date;
}

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Lead Nurturing Templates by Program Type
export const nurtureTemplates = {
  veterans: {
    immediate: {
      subject: "🇺🇸 Thank you for reaching out - Veterans Housing Available",
      template: `Hi {{firstName}},

Thank you for contacting Forward Horizon about veterans housing. As a fellow supporter of our veterans, I wanted to personally reach out.

I understand the unique challenges veterans face when transitioning to civilian housing, and we're here to help make that process as smooth as possible.

**What happens next:**
✅ I'll call you within the next few hours to discuss your specific situation
✅ We can schedule a brief 15-minute consultation at your convenience  
✅ I'll answer any questions about our veterans housing program

**Immediate Resources:**
- Veterans Crisis Line: 988 (Press 1)
- VA Benefits: 1-800-827-1000

I'm here to support you. You served our country - now let us serve you.

Best regards,
Jumaane Bey
Forward Horizon
(626) 603-0954`
    },
    followUp24hr: {
      subject: "🏠 Veterans Housing Update - Let's Connect",
      template: `Hi {{firstName}},

I wanted to follow up on your interest in our veterans housing program. 

**Quick question:** What's your biggest concern about finding stable housing right now?

Many veterans tell me their main worries are:
• Finding a place that understands military background
• Navigating VA benefits for housing assistance
• Getting into a supportive community environment

**I'd like to offer you a quick 10-minute call** to discuss how we can specifically help with your situation. 

When would be a good time for you today or tomorrow? I have openings at:
- Today: 2:00 PM, 4:30 PM
- Tomorrow: 10:00 AM, 1:00 PM, 3:30 PM

Just reply with your preferred time, or call me directly at (626) 603-0954.

Honor and respect,
Jumaane Bey`
    },
    followUp3day: {
      subject: "🎯 Still here to help - Veterans housing question",
      template: `Hi {{firstName}},

I haven't heard back from you, but I wanted to make sure you know I'm still here if you need housing assistance.

Sometimes veterans feel hesitant to reach out again, but please know:
• There's no pressure or obligation
• Our conversation is completely confidential
• We work at YOUR pace, on YOUR timeline

**One simple question:** Would a 5-minute text conversation be easier than a phone call?

I can text you at {{phone}} if that feels more comfortable, or you can reply to this email with just a "yes" or "no" to let me know you're still interested.

Your service matters, and so does your housing stability.

Semper Fi,
Jumaane Bey
Forward Horizon`
    }
  },

  recovery: {
    immediate: {
      subject: "🌱 Your recovery housing inquiry - Safe space available",
      template: `Hi {{firstName}},

Thank you for reaching out about our recovery housing program. Taking this step shows incredible courage and strength.

**You're not alone in this journey.** Our sober living community understands exactly what you're going through, and we're here to support your recovery every step of the way.

**What I'll do for you today:**
✅ Call you within 2 hours to discuss your needs privately
✅ Answer any questions about our program (no judgment, just support)
✅ Explain how we can help maintain your sobriety in a safe environment

**Crisis Resources (available 24/7):**
- SAMHSA Helpline: 1-800-662-4357
- Crisis Text Line: Text HOME to 741741

**Your recovery matters.** Let's talk about how we can support you.

In recovery together,
Jumaane Bey
Forward Horizon
(626) 603-0954`
    },
    followUp24hr: {
      subject: "🤝 Checking in - Recovery housing support",
      template: `Hi {{firstName}},

I hope you're doing well today. Recovery can feel overwhelming, especially when you're looking for stable housing.

**I wanted to share what makes our community special:**
• 24/7 peer support from people who understand your journey
• Structured environment that supports your recovery goals  
• Help with job placement and life skills
• No judgment - just genuine support and encouragement

**Question:** What's your biggest worry about sober living right now?

Many people tell me they're concerned about:
- Finding a place that truly supports recovery
- Affording rent while getting back on their feet
- Being around people who understand addiction

I'd love to address your specific concerns. Would you prefer a quick call or would texting be more comfortable for you right now?

One day at a time,
Jumaane Bey`
    },
    followUp3day: {
      subject: "💚 Still rooting for you - Recovery housing",
      template: `Hi {{firstName}},

I haven't heard from you, but I want you to know I'm still here and still rooting for your success.

**Recovery is hard.** Finding the right support system is even harder. But you don't have to figure it all out alone.

If you're ready to talk, I'm ready to listen - no pressure, no sales pitch, just someone who believes in your recovery.

**Simple next step:** Just reply with "CALL ME" and I'll reach out today.

If you're not ready yet, that's okay too. Save this email - I'll be here when you are.

Your recovery is worth fighting for.

Believing in you,
Jumaane Bey
(626) 603-0954`
    }
  },

  reentry: {
    immediate: {
      subject: "🔑 Your fresh start begins now - Re-entry housing available",
      template: `Hi {{firstName}},

Thank you for reaching out about our re-entry housing program. I want you to know that your past doesn't define your future, and we're here to help you build the life you deserve.

**Reintegrating into the community is challenging,** but you don't have to do it alone. Our program provides the support, resources, and stable housing you need for a successful transition.

**What I'll do for you today:**
✅ Call you within a few hours for a private, confidential conversation
✅ Explain our comprehensive re-entry support services
✅ Help you understand what resources are immediately available

**Your second chance starts now.** Let's talk about making it count.

**Immediate Resources:**
- National Reentry Hotline: 1-844-448-2687
- Crisis Support: Text HOME to 741741

Looking forward to supporting your fresh start,
Jumaane Bey
Forward Horizon
(626) 603-0954`
    },
    followUp24hr: {
      subject: "🏠 Re-entry housing follow-up - Your questions answered",
      template: `Hi {{firstName}},

I wanted to follow up on your interest in our re-entry housing program.

**I know you might have concerns** - most people do when they're planning their reintegration. The most common questions I hear are:

• "Will I be judged for my past?"
• "Can I really afford this while getting back on my feet?"
• "What if I can't find work with my background?"

**Here's the truth:** We specialize in second chances. Our program includes:
✅ Help with job placement at second-chance employers
✅ Assistance getting essential documents (ID, Social Security card, etc.)
✅ Support navigating benefits and resources you qualify for

**I'd like to offer you a brief 15-minute call** to address your specific situation. When would work best for you?

Your future is brighter than your past,
Jumaane Bey`
    },
    followUp3day: {
      subject: "💪 Your comeback story starts here - Re-entry support",
      template: `Hi {{firstName}},

I believe everyone deserves a second chance, and I believe in your comeback story.

**Maybe you're hesitant to reach out again** - I get it. Starting over can feel overwhelming, and trusting new people isn't easy after everything you've been through.

But here's what I want you to know:
• We don't judge - we support
• We've helped hundreds of people successfully reintegrate
• Your success is our success

**One simple question:** Are you still interested in learning about our re-entry housing?

Just reply "YES" or "NO" - no explanation needed. If it's yes, I'll call you. If it's no, I respect that and won't contact you again.

Either way, I'm rooting for your success.

Your advocate,
Jumaane Bey
Forward Horizon`
    }
  }
};

// Create nurturing sequence for a new lead
export async function createNurtureSequence(lead: Lead): Promise<NurtureTask[]> {
  const tasks: NurtureTask[] = [];
  const now = new Date();
  const program = lead.program.toLowerCase();
  
  // Immediate response task (within 1-4 hours based on risk)
  const immediateDelay = lead.riskScore >= 80 ? 15 : // Critical: 15 minutes
                        lead.riskScore >= 60 ? 120 : // High: 2 hours  
                        lead.riskScore >= 30 ? 240 : // Moderate: 4 hours
                        480; // Early: 8 hours

  tasks.push({
    id: crypto.randomUUID(),
    leadId: lead.id,
    type: 'call',
    priority: lead.riskScore >= 80 ? 'critical' : 
              lead.riskScore >= 60 ? 'high' :
              lead.riskScore >= 30 ? 'medium' : 'low',
    status: 'pending',
    scheduledFor: new Date(now.getTime() + immediateDelay * 60000),
    title: `URGENT: Call ${lead.firstName} ${lead.lastName}`,
    description: `Initial outreach call for ${program} housing inquiry. Risk score: ${lead.riskScore}`,
    createdAt: now
  });

  // Send immediate email
  tasks.push({
    id: crypto.randomUUID(),
    leadId: lead.id,
    type: 'email',
    priority: 'high',
    status: 'pending',
    scheduledFor: new Date(now.getTime() + 5 * 60000), // 5 minutes
    title: `Send immediate response email to ${lead.firstName}`,
    description: `Send personalized immediate response email for ${program} program`,
    createdAt: now
  });

  // 24-hour follow-up email
  tasks.push({
    id: crypto.randomUUID(),
    leadId: lead.id,
    type: 'email',
    priority: 'medium',
    status: 'pending',
    scheduledFor: new Date(now.getTime() + 24 * 60 * 60000), // 24 hours
    title: `24hr follow-up email to ${lead.firstName}`,
    description: `Send 24-hour follow-up email for ${program} program`,
    createdAt: now
  });

  // 3-day follow-up email
  tasks.push({
    id: crypto.randomUUID(),
    leadId: lead.id,
    type: 'email',
    priority: 'low',
    status: 'pending',
    scheduledFor: new Date(now.getTime() + 3 * 24 * 60 * 60000), // 3 days
    title: `3-day follow-up email to ${lead.firstName}`,
    description: `Send final follow-up email for ${program} program`,
    createdAt: now
  });

  // Save tasks to database if Supabase is available
  // (We'll create a tasks table later)
  
  return tasks;
}

// Send nurture email
export async function sendNurtureEmail(lead: Lead, templateType: 'immediate' | 'followUp24hr' | 'followUp3day'): Promise<boolean> {
  try {
    const program = lead.program.toLowerCase().includes('veteran') ? 'veterans' :
                   lead.program.toLowerCase().includes('recovery') ? 'recovery' : 'reentry';
    
    const template = nurtureTemplates[program as keyof typeof nurtureTemplates][templateType];
    
    if (!template) {
      console.error(`Template not found for program: ${program}, type: ${templateType}`);
      return false;
    }

    // Replace template variables
    const personalizedSubject = template.subject.replace(/\{\{firstName\}\}/g, lead.firstName);
    const personalizedTemplate = template.template
      .replace(/\{\{firstName\}\}/g, lead.firstName)
      .replace(/\{\{lastName\}\}/g, lead.lastName || '')
      .replace(/\{\{phone\}\}/g, lead.phone || 'your number')
      .replace(/\{\{program\}\}/g, lead.program);

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Jumaane Bey - Forward Horizon" <${process.env.EMAIL_USER}>`,
      to: lead.email,
      subject: personalizedSubject,
      text: personalizedTemplate,
      html: personalizedTemplate.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Nurture email sent to ${lead.firstName} (${templateType})`);
    return true;
    
  } catch (error) {
    console.error('❌ Failed to send nurture email:', error);
    return false;
  }
}

// Get pending nurture tasks
export async function getPendingNurtureTasks(): Promise<NurtureTask[]> {
  // This would query the database for pending tasks
  // For now, return empty array - we'll implement database storage next
  return [];
}

// Mark task as completed
export async function completeNurtureTask(taskId: string, notes?: string): Promise<boolean> {
  try {
    // Update task status in database
    // For now, just log it
    console.log(`✅ Task completed: ${taskId} - ${notes || 'No notes'}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to complete task:', error);
    return false;
  }
}

// Priority-based lead scoring for nurturing
export function calculateNurturePriority(lead: Lead): {
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  nextAction: string;
} {
  // Critical (immediate attention needed)
  if (lead.riskScore >= 80) {
    return {
      priority: 'critical',
      reason: 'High-risk situation requiring immediate intervention',
      nextAction: 'Call within 15 minutes'
    };
  }
  
  // High priority
  if (lead.riskScore >= 60 || lead.program.toLowerCase().includes('veteran')) {
    return {
      priority: 'high',
      reason: 'Urgent housing need or veteran priority status',
      nextAction: 'Call within 2 hours'
    };
  }
  
  // Medium priority  
  if (lead.riskScore >= 30) {
    return {
      priority: 'medium',
      reason: 'Moderate housing need with some urgency',
      nextAction: 'Call within 4 hours'
    };
  }
  
  // Low priority
  return {
    priority: 'low',
    reason: 'Early inquiry, likely researching options',
    nextAction: 'Call within 8 hours'
  };
}