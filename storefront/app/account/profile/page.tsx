import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/account/profile-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const PROFILE_QUERY = `
  query AccountProfile {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

interface ProfileData {
  customer: {
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
  } | null;
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  let data: ProfileData | null = null;
  let error: string | null = null;

  try {
    data = await customerQuery<ProfileData>({ query: PROFILE_QUERY });
  } catch (e) {
    if (e instanceof CustomerAccountAPIError && e.status === 401) {
      redirect('/account/login?return_to=/account/profile');
    }
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load profile';
    }
  }

  const customer = data?.customer ?? null;

  return (
    <>
      <header>
        <h1 className="font-bomstad-display text-3xl md:text-4xl font-bold text-blue-ruin">
          Profile
        </h1>
      </header>
      <Card className="rounded-2xl border border-blue-ruin/15 bg-sugar-milk text-blue-ruin">
        <CardHeader>
          <CardTitle className="font-bomstad-display text-xl md:text-2xl text-blue-ruin">
            Personal info
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <pre className="text-sm whitespace-pre-wrap text-red-700">
              {error}
            </pre>
          ) : customer ? (
            <ProfileForm
              defaultValues={{
                firstName: customer.firstName ?? '',
                lastName: customer.lastName ?? ''
              }}
              email={customer.emailAddress?.emailAddress ?? ''}
            />
          ) : (
            <p className="text-sm text-blue-ruin/80">
              Couldn’t load your profile. Refresh to try again.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
