'use server';

import { revalidatePath } from 'next/cache';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';

interface ProfileInput {
  firstName: string;
  lastName: string;
}

interface ProfileUpdateResponse {
  customerUpdate: {
    customer: { id: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
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

export type UpdateProfileResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function updateProfile(
  values: ProfileInput
): Promise<UpdateProfileResult> {
  try {
    const data = await customerQuery<ProfileUpdateResponse>({
      query: UPDATE_PROFILE_MUTATION,
      variables: {
        input: {
          firstName: values.firstName,
          lastName: values.lastName
        }
      }
    });

    const { userErrors } = data.customerUpdate;
    if (userErrors.length > 0) {
      const fieldErrors: Record<string, string> = {};
      for (const err of userErrors) {
        if (err.field && err.field.length > 0) {
          const lastField = err.field[err.field.length - 1];
          if (lastField) fieldErrors[lastField] = err.message;
        }
      }
      return {
        ok: false,
        error: userErrors[0]?.message ?? 'Update failed',
        fieldErrors:
          Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
      };
    }

    revalidatePath('/account');
    revalidatePath('/account/profile');
    return { ok: true };
  } catch (e) {
    if (e instanceof CustomerAccountAPIError) {
      return { ok: false, error: e.message };
    }
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Update failed'
    };
  }
}
