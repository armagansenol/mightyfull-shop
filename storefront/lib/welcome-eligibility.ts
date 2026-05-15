import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { getSession } from '@/lib/shopify/customer-account/session';

export type WelcomeEligibility =
  | { kind: 'anonymous' }
  | { kind: 'eligible'; email: string }
  | { kind: 'has-orders' };

const ELIGIBILITY_QUERY = `
  query WelcomeEligibility {
    customer {
      emailAddress {
        emailAddress
      }
      orders(first: 1) {
        nodes {
          id
        }
      }
    }
  }
`;

interface EligibilityData {
  customer: {
    emailAddress: { emailAddress: string } | null;
    orders: { nodes: Array<{ id: string }> };
  } | null;
}

// Decides whether the welcome-discount popup + reopen badge should render
// at all, and whether to prefill the email for a logged-in customer who
// hasn't placed their first order yet. Falls back to the anonymous flow
// on any auth/API failure so the marketing surface still works.
export async function getWelcomeEligibility(): Promise<WelcomeEligibility> {
  const session = await getSession();
  if (!session) return { kind: 'anonymous' };

  try {
    const data = await customerQuery<EligibilityData>({
      query: ELIGIBILITY_QUERY
    });

    const customer = data.customer;
    if (!customer) return { kind: 'anonymous' };

    if (customer.orders.nodes.length > 0) return { kind: 'has-orders' };

    const email = customer.emailAddress?.emailAddress;
    if (!email) return { kind: 'anonymous' };

    return { kind: 'eligible', email };
  } catch (err) {
    if (!(err instanceof CustomerAccountAPIError)) {
      console.error('welcome-eligibility:', err);
    }
    return { kind: 'anonymous' };
  }
}
