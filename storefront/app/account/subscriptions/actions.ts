'use server';

import { revalidatePath } from 'next/cache';
import {
  CANCELLATION_REASONS,
  type CancellationReasonValue,
  FREQUENCY_OPTIONS,
  type SubscriptionShippingAddressInput
} from '@/app/account/subscriptions/constants';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';
import { adminQuery } from '@/lib/shopify/admin';

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

const NEXT_CYCLE_QUERY = `
  query NextBillingCycle($idQuery: String!) {
    customer {
      subscriptionContracts(first: 1, query: $idQuery) {
        nodes {
          id
          nextBillingDate
          billingCycles(first: 8) {
            nodes {
              cycleIndex
              cycleStartAt
              billingAttemptExpectedDate
              skipped
            }
          }
        }
      }
    }
  }
`;

const SKIP_CYCLE_MUTATION = `
  mutation SkipBillingCycle(
    $billingCycleInput: SubscriptionBillingCycleInput!
    $skip: Boolean!
  ) {
    subscriptionBillingCycleSkip(
      billingCycleInput: $billingCycleInput
      skip: $skip
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

const OPEN_DRAFT_MUTATION = `
  mutation OpenSubscriptionDraft($id: ID!) {
    subscriptionContractUpdate(subscriptionContractId: $id) {
      draft {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DRAFT_UPDATE_MUTATION = `
  mutation UpdateSubscriptionDraft(
    $draftId: ID!
    $input: SubscriptionDraftInput!
  ) {
    subscriptionDraftUpdate(draftId: $draftId, input: $input) {
      draft {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DRAFT_COMMIT_MUTATION = `
  mutation CommitSubscriptionDraft($draftId: ID!) {
    subscriptionDraftCommit(draftId: $draftId) {
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

    // Customer Account API's subscriptionContractCancel does not accept a
    // reason — log here so it can be forwarded to analytics (Klaviyo) when
    // the Phase 7 event wiring lands.
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

interface BillingCycleNode {
  cycleIndex: number;
  cycleStartAt: string;
  billingAttemptExpectedDate: string | null;
  skipped: boolean;
}

async function findNextUnskippedCycle(
  contractGid: string
): Promise<{ cycle: BillingCycleNode | null; error?: string }> {
  // contractGid is something like "gid://shopify/SubscriptionContract/12345"
  const numericId = contractGid.split('/').pop() ?? contractGid;
  try {
    const data = await customerQuery<{
      customer: {
        subscriptionContracts: {
          nodes: Array<{
            id: string;
            nextBillingDate: string | null;
            billingCycles: { nodes: BillingCycleNode[] };
          }>;
        };
      } | null;
    }>({
      query: NEXT_CYCLE_QUERY,
      variables: { idQuery: `id:${numericId}` }
    });

    const contract = data.customer?.subscriptionContracts.nodes[0];
    if (!contract) {
      return { cycle: null, error: 'Subscription not found' };
    }

    const now = Date.now();
    const upcoming = contract.billingCycles.nodes
      .filter((c) => !c.skipped)
      .filter((c) => new Date(c.cycleStartAt).getTime() >= now)
      .sort((a, b) => a.cycleIndex - b.cycleIndex)[0];

    return { cycle: upcoming ?? null };
  } catch (e) {
    return {
      cycle: null,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to load billing cycles'
    };
  }
}

async function withDraft(
  subscriptionContractId: string,
  apply: (draftId: string) => Promise<SubscriptionActionResult>
): Promise<SubscriptionActionResult> {
  try {
    const openData = await customerQuery<{
      subscriptionContractUpdate: {
        draft: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: OPEN_DRAFT_MUTATION,
      variables: { id: subscriptionContractId }
    });

    if (openData.subscriptionContractUpdate.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(openData.subscriptionContractUpdate.userErrors)
      };
    }
    const draftId = openData.subscriptionContractUpdate.draft?.id;
    if (!draftId) {
      return { ok: false, error: 'Could not open subscription for editing.' };
    }

    const applied = await apply(draftId);
    if (!applied.ok) return applied;

    const commitData = await customerQuery<{
      subscriptionDraftCommit: {
        contract: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: DRAFT_COMMIT_MUTATION,
      variables: { draftId }
    });

    if (commitData.subscriptionDraftCommit.userErrors.length > 0) {
      return {
        ok: false,
        error: firstUserError(commitData.subscriptionDraftCommit.userErrors)
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
            : 'Failed to update subscription'
    };
  }
}

async function updateDraft(
  draftId: string,
  input: Record<string, unknown>
): Promise<SubscriptionActionResult> {
  const data = await customerQuery<{
    subscriptionDraftUpdate: {
      draft: { id: string } | null;
      userErrors: UserError[];
    };
  }>({
    query: DRAFT_UPDATE_MUTATION,
    variables: { draftId, input }
  });

  if (data.subscriptionDraftUpdate.userErrors.length > 0) {
    return {
      ok: false,
      error: firstUserError(data.subscriptionDraftUpdate.userErrors)
    };
  }
  return { ok: true };
}

export async function updateSubscriptionShippingAddress(
  subscriptionContractId: string,
  address: SubscriptionShippingAddressInput
): Promise<SubscriptionActionResult> {
  // Customer Account API's SubscriptionMailingAddressInput uses ISO
  // `provinceCode` and `countryCode`, plus `phone` (not `phoneNumber`).
  const mailingAddress = {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    provinceCode: address.zoneCode,
    zip: address.zip,
    countryCode: address.territoryCode,
    phone: address.phoneNumber
  };

  return withDraft(subscriptionContractId, (draftId) =>
    updateDraft(draftId, {
      deliveryMethod: {
        shipping: { address: mailingAddress }
      }
    })
  );
}

export async function changeSubscriptionFrequency(
  subscriptionContractId: string,
  optionValue: string
): Promise<SubscriptionActionResult> {
  const option = FREQUENCY_OPTIONS.find((o) => o.value === optionValue);
  if (!option) {
    return { ok: false, error: 'Unknown frequency option.' };
  }

  return withDraft(subscriptionContractId, (draftId) =>
    updateDraft(draftId, {
      deliveryPolicy: {
        interval: option.interval,
        intervalCount: option.intervalCount
      },
      billingPolicy: {
        interval: option.interval,
        intervalCount: option.intervalCount
      }
    })
  );
}

const GET_CONTRACT_PAYMENT_METHOD_QUERY = `
  query GetSubscriptionPaymentMethod($id: ID!) {
    subscriptionContract(id: $id) {
      customerPaymentMethod {
        id
      }
    }
  }
`;

const SEND_PAYMENT_UPDATE_EMAIL_MUTATION = `
  mutation SendPaymentUpdateEmail($customerPaymentMethodId: ID!) {
    customerPaymentMethodSendUpdateEmail(
      customerPaymentMethodId: $customerPaymentMethodId
    ) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function sendPaymentMethodUpdateEmail(
  subscriptionContractId: string
): Promise<SubscriptionActionResult> {
  try {
    const contractData = await adminQuery<{
      subscriptionContract: {
        customerPaymentMethod: { id: string } | null;
      } | null;
    }>({
      query: GET_CONTRACT_PAYMENT_METHOD_QUERY,
      variables: { id: subscriptionContractId }
    });

    const paymentMethodId =
      contractData.subscriptionContract?.customerPaymentMethod?.id;

    if (!paymentMethodId) {
      return {
        ok: false,
        error: 'No payment method found for this subscription.'
      };
    }

    const emailData = await adminQuery<{
      customerPaymentMethodSendUpdateEmail: {
        customer: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: SEND_PAYMENT_UPDATE_EMAIL_MUTATION,
      variables: { customerPaymentMethodId: paymentMethodId }
    });

    if (
      emailData.customerPaymentMethodSendUpdateEmail.userErrors.length > 0
    ) {
      return {
        ok: false,
        error: firstUserError(
          emailData.customerPaymentMethodSendUpdateEmail.userErrors
        )
      };
    }

    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : 'Failed to send payment update email'
    };
  }
}

export async function skipNextBillingCycle(
  subscriptionContractId: string
): Promise<SubscriptionActionResult> {
  const { cycle, error } = await findNextUnskippedCycle(subscriptionContractId);
  if (error) return { ok: false, error };
  if (!cycle) {
    return { ok: false, error: 'No upcoming charge to skip.' };
  }

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
          selector: { index: cycle.cycleIndex }
        },
        skip: true
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
