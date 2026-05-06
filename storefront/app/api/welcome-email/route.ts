import { NextResponse } from 'next/server';

type WelcomeEmailResponse = {
  success: boolean;
  message: string;
};

export async function POST(
  request: Request
): Promise<NextResponse<WelcomeEmailResponse>> {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const listId = process.env.KLAVIYO_WELCOME_LIST_ID;

    if (!listId) {
      console.error('KLAVIYO_WELCOME_LIST_ID is not set');
      return NextResponse.json(
        { success: false, message: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    const res = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2025-01-15',
          'content-type': 'application/vnd.api+json',
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email,
                      subscriptions: {
                        email: {
                          marketing: {
                            consent: 'SUBSCRIBED'
                          }
                        }
                      }
                    }
                  }
                ]
              },
              historical_import: false
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: listId
                }
              }
            }
          }
        })
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('Klaviyo error:', body);
      throw new Error('Failed to subscribe');
    }

    return NextResponse.json(
      { success: true, message: "Check your inbox — your code is on the way!" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
