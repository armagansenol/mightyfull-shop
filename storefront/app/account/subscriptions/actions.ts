'use server';

import { revalidatePath } from 'next/cache';
import {
  CANCELLATION_REASONS,
  type CancellationReasonValue,
  type SubscriptionShippingAddressInput
} from '@/app/account/subscriptions/constants';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';

interface UserError {
  field: string[] | null;
  message: string;
}

export type SubscriptionActionResult =
  | { ok: true }
  | { ok: false; error: string };

const PAUSE_MUTATION = `
  mutation PauseSubscription($subscriptionContractId: ID!) {
    subscriptionContractPause(
      subscriptionContractId: $subscriptionContractId
    ) {
      contract {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ACTIVATE_MUTATION = `
  mutation ActivateSubscription($subscriptionContractId: ID!) {
    subscriptionContractActivate(
      subscriptionContractId: $subscriptionContractId
    ) {
      contract {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CANCEL_MUTATION = `
  mutation CancelSubscription($subscriptionContractId: ID!) {
    subscriptionContractCancel(
      subscriptionContractId: $subscriptionContractId
    ) {
      contract {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const SKIP_CYCLE_MUTATION = `
  mutation SkipBillingCycle(
    $billingCycleInput: SubscriptionBillingCycleInput!
  ) {
    subscriptionBillingCycleSkip(
      billingCycleInput: $billingCycleInput
    ) {
      billingCycle {
        cycleIndex
        skipped
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UNSKIP_CYCLE_MUTATION = `
  mutation UnskipBillingCycle(
    $billingCycleInput: SubscriptionBillingCycleInput!
  ) {
    subscriptionBillingCycleUnskip(
      billingCycleInput: $billingCycleInput
    ) {
      billingCycle {
        cycleIndex
        skipped
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const FETCH_DELIVERY_OPTIONS_MUTATION = `
  mutation FetchDeliveryOptions($id: ID!, $address: CustomerAddressInput) {
    subscriptionContractFetchDeliveryOptions(
      subscriptionContractId: $id
      address: $address
    ) {
      deliveryOptionsResult {
        __typename
        ... on SubscriptionDeliveryOptionsResultSuccess {
          token
        }
        ... on SubscriptionDeliveryOptionsResultFailure {
          message
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const SELECT_DELIVERY_METHOD_MUTATION = `
  mutation SelectDeliveryMethod(
    $id: ID!
    $input: SubscriptionDeliveryMethodInput!
    $token: String!
  ) {
    subscriptionContractSelectDeliveryMethod(
      subscriptionContractId: $id
      deliveryMethodInput: $input
      subscriptionDeliveryOptionsResultToken: $token
    ) {
      contract {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function firstUserError(errors: UserError[]): string {
  return errors[0]?.message ?? 'Something went wrong';
}

function revalidateSubscriptionPaths() {
  revalidatePath('/account');
  revalidatePath('/account/subscriptions');
  revalidatePath('/account/subscriptions/[id]', 'page');
}

export async function pauseSubscription(
  subscriptionContractId: string
): Promise<SubscriptionActionResult> {
  try {
    const data = await customerQuery<{
      subscriptionContractPause: {
        contract: { id: string; status: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: PAUSE_MUTATION,
      variables: { subscriptionContractId }
    });

    if (data.subscriptionContractPause.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(data.subscriptionContractPause.userErrors)
      };
    }

    revalidateSubscriptionPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to pause subscription'
    };
  }
}

export async function resumeSubscription(
  subscriptionContractId: string
): Promise<SubscriptionActionResult> {
  try {
    const data = await customerQuery<{
      subscriptionContractActivate: {
        contract: { id: string; status: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: ACTIVATE_MUTATION,
      variables: { subscriptionContractId }
    });

    if (data.subscriptionContractActivate.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(data.subscriptionContractActivate.userErrors)
      };
    }

    revalidateSubscriptionPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to resume subscription'
    };
  }
}

interface CancelSubscriptionInput {
  subscriptionContractId: string;
  reason: CancellationReasonValue;
  notes?: string;
}

function reasonLabel(value: CancellationReasonValue): string {
  return CANCELLATION_REASONS.find((r) => r.value === value)?.label ?? value;
}

export async function cancelSubscription(
  input: CancelSubscriptionInput
): Promise<SubscriptionActionResult> {
  const { subscriptionContractId, reason, notes } = input;
  try {
    const data = await customerQuery<{
      subscriptionContractCancel: {
        contract: { id: string; status: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: CANCEL_MUTATION,
      variables: { subscriptionContractId }
    });

    if (data.subscriptionContractCancel.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(data.subscriptionContractCancel.userErrors)
      };
    }

    console.info('[subscription cancelled]', {
      contractId: subscriptionContractId,
      reason,
      reasonLabel: reasonLabel(reason),
      notes: notes?.trim() || null
    });

    revalidateSubscriptionPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to cancel subscription'
    };
  }
}

// Customer Account API two-step flow for changing the shipping address on
// a subscription contract:
//   1. subscriptionContractFetchDeliveryOptions(contractId, address)
//      → returns a token + the rate options Shopify can offer for that
//        address. (Returns Failure if the address can't be shipped to.)
//   2. subscriptionContractSelectDeliveryMethod(contractId, input, token)
//      → commits the address change; Shopify picks the matching rate
//        from the previously-fetched options.
export async function updateSubscriptionShippingAddress(
  subscriptionContractId: string,
  address: SubscriptionShippingAddressInput
): Promise<SubscriptionActionResult> {
  const customerAddress = {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    zip: address.zip,
    zoneCode: address.zoneCode,
    territoryCode: address.territoryCode,
    phoneNumber: address.phoneNumber
  };

  // Up to ~7s of polling: first call typically returns null (pending)
  // while Shopify computes shippable rates for the new address.
  const MAX_ATTEMPTS = 10;
  const RETRY_DELAY_MS = 700;

  try {
    let token: string | null = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const fetchData = await customerQuery<{
        subscriptionContractFetchDeliveryOptions: {
          deliveryOptionsResult:
            | {
                __typename: 'SubscriptionDeliveryOptionsResultSuccess';
                token: string;
              }
            | {
                __typename: 'SubscriptionDeliveryOptionsResultFailure';
                message: string;
              }
            | null;
          userErrors: UserError[];
        };
      }>({
        query: FETCH_DELIVERY_OPTIONS_MUTATION,
        variables: { id: subscriptionContractId, address: customerAddress }
      });

      const payload = fetchData.subscriptionContractFetchDeliveryOptions;
      if (payload.userErrors.length > 0) {
        return { ok: false, error: firstUserError(payload.userErrors) };
      }
      const result = payload.deliveryOptionsResult;
      if (result?.__typename === 'SubscriptionDeliveryOptionsResultSuccess') {
        token = result.token;
        break;
      }
      if (result?.__typename === 'SubscriptionDeliveryOptionsResultFailure') {
        return {
          ok: false,
          error: result.message ?? "We can't ship to this address."
        };
      }
      // pending — wait and retry
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }

    if (!token) {
      return {
        ok: false,
        error:
          'Shopify is still computing delivery options for this address. Please try again in a moment.'
      };
    }

    const selectData = await customerQuery<{
      subscriptionContractSelectDeliveryMethod: {
        contract: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: SELECT_DELIVERY_METHOD_MUTATION,
      variables: {
        id: subscriptionContractId,
        input: { shipping: { shippingAddress: customerAddress } },
        token
      }
    });

    const selectErrors =
      selectData.subscriptionContractSelectDeliveryMethod.userErrors;
    if (selectErrors.length > 0) {
      return { ok: false, error: firstUserError(selectErrors) };
    }

    revalidateSubscriptionPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to update shipping address'
    };
  }
}

export async function skipBillingCycle(
  subscriptionContractId: string,
  cycleIndex: number
): Promise<SubscriptionActionResult> {
  try {
    const data = await customerQuery<{
      subscriptionBillingCycleSkip: {
        billingCycle: { cycleIndex: number; skipped: boolean } | null;
        userErrors: UserError[];
      };
    }>({
      query: SKIP_CYCLE_MUTATION,
      variables: {
        billingCycleInput: {
          contractId: subscriptionContractId,
          selector: { index: cycleIndex }
        }
      }
    });

    if (data.subscriptionBillingCycleSkip.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(data.subscriptionBillingCycleSkip.userErrors)
      };
    }

    revalidateSubscriptionPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to skip charge'
    };
  }
}

export async function unskipBillingCycle(
  subscriptionContractId: string,
  cycleIndex: number
): Promise<SubscriptionActionResult> {
  try {
    const data = await customerQuery<{
      subscriptionBillingCycleUnskip: {
        billingCycle: { cycleIndex: number; skipped: boolean } | null;
        userErrors: UserError[];
      };
    }>({
      query: UNSKIP_CYCLE_MUTATION,
      variables: {
        billingCycleInput: {
          contractId: subscriptionContractId,
          selector: { index: cycleIndex }
        }
      }
    });

    if (data.subscriptionBillingCycleUnskip.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(data.subscriptionBillingCycleUnskip.userErrors)
      };
    }

    revalidateSubscriptionPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to unskip charge'
    };
  }
}
