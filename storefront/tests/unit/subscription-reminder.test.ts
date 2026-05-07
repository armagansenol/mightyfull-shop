import { describe, expect, it } from 'vitest';
import {
  KLAVIYO_EVENT_NAME,
  buildEventPayload,
  filterContractsForTargetDate,
  getTargetDate,
  type SubscriptionContractNode
} from '@/lib/subscription-reminder';

function makeContract(
  overrides: Partial<SubscriptionContractNode> = {}
): SubscriptionContractNode {
  return {
    id: 'gid://shopify/SubscriptionContract/1',
    status: 'ACTIVE',
    nextBillingDate: '2026-05-12T00:00:00Z',
    customer: {
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe'
    },
    lines: {
      edges: [
        {
          node: {
            title: 'Crunchy Cookie 6-pack',
            currentPrice: { amount: '24.00', currencyCode: 'USD' }
          }
        }
      ]
    },
    ...overrides
  };
}

describe('getTargetDate', () => {
  it('returns YYYY-MM-DD for now + N days in UTC', () => {
    const now = new Date('2026-05-07T08:00:00Z');
    expect(getTargetDate(5, now)).toBe('2026-05-12');
  });

  it('rolls over month boundaries', () => {
    const now = new Date('2026-05-30T08:00:00Z');
    expect(getTargetDate(5, now)).toBe('2026-06-04');
  });

  it('handles late-UTC times without slipping into the previous day', () => {
    const now = new Date('2026-05-07T23:59:00Z');
    expect(getTargetDate(5, now)).toBe('2026-05-12');
  });
});

describe('filterContractsForTargetDate', () => {
  const targetDate = '2026-05-12';

  it('keeps contracts whose nextBillingDate starts with the target date', () => {
    const match = makeContract({ nextBillingDate: '2026-05-12T08:30:00Z' });
    const miss = makeContract({
      id: 'gid://shopify/SubscriptionContract/2',
      nextBillingDate: '2026-05-13T00:00:00Z'
    });

    const result = filterContractsForTargetDate([match, miss], targetDate);
    expect(result).toEqual([match]);
  });

  it('drops contracts with null nextBillingDate', () => {
    const contract = makeContract({ nextBillingDate: null });
    expect(filterContractsForTargetDate([contract], targetDate)).toEqual([]);
  });

  it('drops contracts without a customer email', () => {
    const noCustomer = makeContract({ customer: null });
    const noEmail = makeContract({
      id: 'gid://shopify/SubscriptionContract/3',
      customer: { email: null, firstName: 'A', lastName: 'B' }
    });

    expect(
      filterContractsForTargetDate([noCustomer, noEmail], targetDate)
    ).toEqual([]);
  });

  it('returns an empty array when no contracts match', () => {
    const contract = makeContract({ nextBillingDate: '2026-05-13T00:00:00Z' });
    expect(filterContractsForTargetDate([contract], targetDate)).toEqual([]);
  });
});

describe('buildEventPayload', () => {
  it('produces a Klaviyo events-payload with profile, metric, and properties', () => {
    const contract = makeContract();

    const payload = buildEventPayload(contract);

    expect(payload).toEqual({
      data: {
        type: 'event',
        attributes: {
          properties: {
            next_billing_date: '2026-05-12T00:00:00Z',
            subscription_id: 'gid://shopify/SubscriptionContract/1',
            items: [
              {
                title: 'Crunchy Cookie 6-pack',
                price: '24.00',
                currency: 'USD'
              }
            ]
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
                email: 'jane@example.com',
                first_name: 'Jane',
                last_name: 'Doe'
              }
            }
          }
        }
      }
    });
  });

  it('maps multiple line items and falls back to null for missing prices', () => {
    const contract = makeContract({
      lines: {
        edges: [
          {
            node: {
              title: 'Item A',
              currentPrice: { amount: '10.00', currencyCode: 'USD' }
            }
          },
          {
            node: {
              title: 'Item B',
              currentPrice: null
            }
          }
        ]
      }
    });

    const payload = buildEventPayload(contract);
    const items = (
      payload.data.attributes.properties as { items: unknown[] }
    ).items;

    expect(items).toEqual([
      { title: 'Item A', price: '10.00', currency: 'USD' },
      { title: 'Item B', price: null, currency: null }
    ]);
  });

  it('omits first_name and last_name when missing on the customer', () => {
    const contract = makeContract({
      customer: {
        email: 'no-name@example.com',
        firstName: null,
        lastName: null
      }
    });

    const attrs = buildEventPayload(contract).data.attributes.profile.data
      .attributes;

    expect(attrs.email).toBe('no-name@example.com');
    expect(attrs.first_name).toBeUndefined();
    expect(attrs.last_name).toBeUndefined();
  });

  it('throws when called on a contract without a customer email', () => {
    const contract = makeContract({ customer: null });
    expect(() => buildEventPayload(contract)).toThrow(/customer email/);
  });
});
