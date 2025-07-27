import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'Email not configured' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test connection
    await transporter.verify();

    // Send simple test email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Test Email - Forward Horizon',
      text: 'This is a test email to verify the email configuration is working.',
    });

    return NextResponse.json({ success: true, message: 'Test email sent' });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: `Email failed: ${error}` },
      { status: 500 }
    );
  }
}