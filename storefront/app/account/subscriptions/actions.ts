'use server';

import { revalidatePath } from 'next/cache';
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

function firstUserError(errors: UserError[]): string {
  return errors[0]?.message ?? 'Something went wrong';
}

function revalidateSubscriptionPaths() {
  revalidatePath('/account');
  revalidatePath('/account/subscriptions');
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

export async function cancelSubscription(
  subscriptionContractId: string
): Promise<SubscriptionActionResult> {
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
