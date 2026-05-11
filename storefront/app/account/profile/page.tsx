import { Mail01Icon, UserAccountIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { redirect } from 'next/navigation';
import { AccountCard } from '@/components/account/account-card';
import { PageHeader } from '@/components/account/page-header';
import { ProfileForm } from '@/components/account/profile-form';
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
  const email = customer?.emailAddress?.emailAddress ?? '';

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Personal info"
        description="Edit your name and review the email tied to your account."
      />

      <AccountCard icon={UserAccountIcon} eyebrow="Identity" title="Your name">
        {error ? (
          <pre
            role="alert"
            className="text-sm whitespace-pre-wrap text-red-700"
          >
            {error}
          </pre>
        ) : customer ? (
          <ProfileForm
            defaultValues={{
              firstName: customer.firstName ?? '',
              lastName: customer.lastName ?? ''
            }}
          />
        ) : (
          <p className="text-sm font-medium text-blue-ruin/75">
            Couldn’t load your profile. Refresh to try again.
          </p>
        )}
      </AccountCard>

      {email && (
        <AccountCard icon={Mail01Icon} eyebrow="Email" title="Sign-in email">
          <div className="flex items-center gap-3 rounded-2xl border border-blue-ruin/15 bg-columbia-blue/30 p-4">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="text-blue-ruin/70 shrink-0"
            />
            <p className="text-base font-semibold text-blue-ruin truncate">
              {email}
            </p>
          </div>
          <p className="text-xs text-blue-ruin/70">
            Email changes are managed via Shopify. Contact support if you need
            to update.
          </p>
        </AccountCard>
      )}
    </>
  );
}
