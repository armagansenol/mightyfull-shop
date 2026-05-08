'use server';

import { revalidatePath } from 'next/cache';
import {
  CustomerAccountAPIError,
  customerQuery
} from '@/lib/shopify/customer-account/client';

export interface AddressInput {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  zoneCode: string;
  zip: string;
  territoryCode: string;
  phoneNumber?: string;
  company?: string;
}

interface UserError {
  field: string[] | null;
  message: string;
}

export type AddressActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const CREATE_ADDRESS = `
  mutation CreateAddress(
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_ADDRESS = `
  mutation UpdateAddress(
    $addressId: ID!
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressUpdate(
      addressId: $addressId
      address: $address
      defaultAddress: $defaultAddress
    ) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_ADDRESS = `
  mutation DeleteAddress($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

// Customer Account API has no dedicated set-default mutation.
// We re-use customerAddressUpdate with defaultAddress: true and an
// empty address payload (all CustomerAddressInput fields are optional
// on update so untouched fields keep their values).
const SET_DEFAULT_ADDRESS = `
  mutation SetDefaultAddress($addressId: ID!) {
    customerAddressUpdate(
      addressId: $addressId
      address: {}
      defaultAddress: true
    ) {
      customerAddress {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function reduceUserErrors(userErrors: UserError[]): {
  error: string;
  fieldErrors?: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};
  for (const err of userErrors) {
    if (err.field && err.field.length > 0) {
      const lastField = err.field[err.field.length - 1];
      if (lastField) fieldErrors[lastField] = err.message;
    }
  }
  return {
    error: userErrors[0]?.message ?? 'Something went wrong',
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
  };
}

function revalidateAddressPaths() {
  revalidatePath('/account');
  revalidatePath('/account/addresses');
}

export async function createAddress(
  values: AddressInput,
  setAsDefault: boolean
): Promise<AddressActionResult> {
  try {
    const data = await customerQuery<{
      customerAddressCreate: {
        customerAddress: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: CREATE_ADDRESS,
      variables: { address: values, defaultAddress: setAsDefault }
    });

    if (data.customerAddressCreate.userErrors.length > 0) {
      return {
        ok: false,
        ...reduceUserErrors(data.customerAddressCreate.userErrors)
      };
    }

    revalidateAddressPaths();
    return {
      ok: true,
      id: data.customerAddressCreate.customerAddress?.id
    };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to create address'
    };
  }
}

export async function updateAddress(
  addressId: string,
  values: AddressInput,
  setAsDefault: boolean
): Promise<AddressActionResult> {
  try {
    const data = await customerQuery<{
      customerAddressUpdate: {
        customerAddress: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: UPDATE_ADDRESS,
      variables: {
        addressId,
        address: values,
        defaultAddress: setAsDefault
      }
    });

    if (data.customerAddressUpdate.userErrors.length > 0) {
      return {
        ok: false,
        ...reduceUserErrors(data.customerAddressUpdate.userErrors)
      };
    }

    revalidateAddressPaths();
    return { ok: true, id: addressId };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to update address'
    };
  }
}

export async function deleteAddress(
  addressId: string
): Promise<AddressActionResult> {
  try {
    const data = await customerQuery<{
      customerAddressDelete: {
        deletedAddressId: string | null;
        userErrors: UserError[];
      };
    }>({
      query: DELETE_ADDRESS,
      variables: { addressId }
    });

    if (data.customerAddressDelete.userErrors.length > 0) {
      return {
        ok: false,
        ...reduceUserErrors(data.customerAddressDelete.userErrors)
      };
    }

    revalidateAddressPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to delete address'
    };
  }
}

export async function setDefaultAddress(
  addressId: string
): Promise<AddressActionResult> {
  try {
    const data = await customerQuery<{
      customerAddressUpdate: {
        customerAddress: { id: string } | null;
        userErrors: UserError[];
      };
    }>({
      query: SET_DEFAULT_ADDRESS,
      variables: { addressId }
    });

    if (data.customerAddressUpdate.userErrors.length > 0) {
      return {
        ok: false,
        ...reduceUserErrors(data.customerAddressUpdate.userErrors)
      };
    }

    revalidateAddressPaths();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof CustomerAccountAPIError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to set default address'
    };
  }
}
