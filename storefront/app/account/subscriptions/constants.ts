export const CANCELLATION_REASONS = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'too_frequent', label: 'Shipments come too often' },
  { value: 'not_frequent_enough', label: "Shipments don't come often enough" },
  { value: 'pause_too_long', label: 'I have enough for now' },
  { value: 'flavor_preference', label: 'I want to try different flavors' },
  { value: 'quality', label: 'Quality issue' },
  { value: 'other', label: 'Other' }
] as const;

export type CancellationReasonValue =
  (typeof CANCELLATION_REASONS)[number]['value'];

export type FrequencyInterval = 'MONTH';

export interface FrequencyOption {
  value: string;
  label: string;
  interval: FrequencyInterval;
  intervalCount: number;
}

export interface SubscriptionShippingAddressInput {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zoneCode?: string;
  zip?: string;
  territoryCode?: string;
  phoneNumber?: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    value: 'month-1',
    label: 'Delivery every month',
    interval: 'MONTH',
    intervalCount: 1
  },
  {
    value: 'month-3',
    label: 'Delivery every 3 months',
    interval: 'MONTH',
    intervalCount: 3
  }
];
