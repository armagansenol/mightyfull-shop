import { NextResponse } from 'next/server';

type ContactFormResponse = {
  success: boolean;
  message: string;
};

export async function POST(
  request: Request
): Promise<NextResponse<ContactFormResponse>> {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Mightyfull Contact <noreply@mightyfull.com>',
        to: 'support@mightyfull.com',
        reply_to: email,
        subject: `New message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `
      })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('Resend error:', body);
      throw new Error('Failed to send email');
    }

    return NextResponse.json(
      { success: true, message: "Thanks! We'll be in touch soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
