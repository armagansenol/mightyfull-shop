import { NextResponse } from 'next/server';

// Define response types
type ContactFormResponse = {
  success: boolean;
  message: string;
};

export async function POST(
  request: Request
): Promise<NextResponse<ContactFormResponse>> {
  try {
    const data = await request.json();

    const sanityEndpoint = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v${process.env.SANITY_API_VERSION}/data/mutate/${process.env.SANITY_DATASET}`;

    const doc = {
      mutations: [
        {
          create: {
            _type: 'contactForm',
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone,
            message: data.message
          }
        }
      ]
    };

    const response = await fetch(sanityEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`
      },
      body: JSON.stringify(doc)
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Sanity');
    }

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
