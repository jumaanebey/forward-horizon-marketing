import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    console.log('Form submission received');
    
    let firstName, email, formType;
    
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await request.json();
      firstName = data.firstName;
      email = data.email;
      formType = data.formType;
    } else {
      const formData = await request.formData();
      firstName = formData.get('firstName')?.toString();
      email = formData.get('email')?.toString();
      formType = formData.get('inquiry_type')?.toString();
    }
    
    console.log('Form data:', { firstName, email, formType });

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!formType) {
      formType = 'general';
    }

    // Log the lead capture
    console.log(`✅ LEAD CAPTURED: ${firstName} (${email}) - ${formType} program`);

    // Redirect to success page
    const redirectUrl = `https://forward-horizon-marketing.vercel.app/thank-you?type=${formType}&name=${encodeURIComponent(firstName)}`;
    
    const htmlRedirect = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <script>window.location.href = "${redirectUrl}";</script>
    </head>
    <body>
        <p>Thank you! Redirecting...</p>
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
    console.error('Error processing form:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}