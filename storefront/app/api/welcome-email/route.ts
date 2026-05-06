import { NextResponse } from 'next/server';

type WelcomeEmailResponse = {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
};

const KLAVIYO_HEADERS = {
  accept: 'application/vnd.api+json',
  revision: '2025-01-15',
  'content-type': 'application/vnd.api+json',
  Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`
};

async function isAlreadySubscribed(email: string, listId: string): Promise<boolean> {
  const url = `https://a.klaviyo.com/api/lists/${listId}/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`;
  const res = await fetch(url, { headers: KLAVIYO_HEADERS });
  if (!res.ok) return false;
  const data = await res.json();
  return Array.isArray(data.data) && data.data.length > 0;
}

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

    const alreadySubscribed = await isAlreadySubscribed(email, listId);

    if (alreadySubscribed) {
      return NextResponse.json(
        { success: true, alreadySubscribed: true, message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    const res = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers: KLAVIYO_HEADERS,
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
