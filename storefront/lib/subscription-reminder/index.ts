export const KLAVIYO_EVENT_NAME = 'Subscription Renewal Reminder';

export type Money = { amount: string; currencyCode: string };

export type SubscriptionContractNode = {
  id: string;
  status: string;
  nextBillingDate: string | null;
  customer: {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
  lines: {
    edges: Array<{
      node: {
        title: string;
        currentPrice: Money | null;
      };
    }>;
  };
};

export function getTargetDate(daysAhead: number, now: Date = new Date()): string {
  const target = new Date(now);
  target.setUTCDate(target.getUTCDate() + daysAhead);
  return target.toISOString().slice(0, 10);
}

export function filterContractsForTargetDate(
  contracts: SubscriptionContractNode[],
  targetDate: string
): SubscriptionContractNode[] {
  return contracts.filter((contract) => {
    if (!contract?.nextBillingDate) return false;
    if (!contract.customer?.email) return false;
    return contract.nextBillingDate.startsWith(targetDate);
  });
}

export function buildEventPayload(contract: SubscriptionContractNode) {
  if (!contract.customer?.email) {
    throw new Error('Cannot build event payload for contract without customer email');
  }

  const customer = contract.customer;
  const items = contract.lines.edges.map(({ node }) => ({
    title: node.title,
    price: node.currentPrice?.amount ?? null,
    currency: node.currentPrice?.currencyCode ?? null
  }));

  return {
    data: {
      type: 'event',
      attributes: {
        properties: {
          next_billing_date: contract.nextBillingDate,
          subscription_id: contract.id,
          items
        },
        metric: {
          data: {
            type: 'metric',
            attributes: { name: KLAVIYO_EVENT_NAME }
          }
        },
        profile: {
          data: {
            type: 'profile',
            attributes: {
              email: customer.email,
              first_name: customer.firstName ?? undefined,
              last_name: customer.lastName ?? undefined
            }
          }
        }
      }
    }
  };
}
