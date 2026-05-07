import { redirect } from 'next/navigation';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export const dynamic = 'force-dynamic';

const CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

interface CustomerData {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
  } | null;
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect('/account/login');
  }

  let customer: CustomerData['customer'] = null;
  let error: string | null = null;

  try {
    const data = await customerQuery<CustomerData>({ query: CUSTOMER_QUERY });
    customer = data.customer;
  } catch (e) {
    if (e instanceof CustomerAccountAPIError) {
      error = `${e.status ?? 'unknown'}: ${e.message}`;
    } else {
      error = e instanceof Error ? e.message : 'Failed to load customer';
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Account (Phase 1 placeholder)</h1>
      {error && (
        <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</pre>
      )}
      {customer && (
        <dl>
          <dt>ID</dt>
          <dd>{customer.id}</dd>
          <dt>Name</dt>
          <dd>
            {customer.firstName} {customer.lastName}
          </dd>
          <dt>Email</dt>
          <dd>{customer.emailAddress?.emailAddress}</dd>
        </dl>
      )}
      <p>
        <a href="/account/logout">Log out</a>
      </p>
    </main>
  );
}
