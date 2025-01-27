import { Client } from './client';

export interface AddPaymentSourceData {
  description?: string;
  gatewayId?: number;
  isPrimaryPaymentSource?: boolean;
  [key: string]: any; // Additional parameters supported by the gateway form
}

export interface SetPrimaryPaymentSourceData {
  id: number; // ID of the payment source
}

export interface DeletePaymentSourceData {
  id: number; // ID of the payment source
}

/**
 * Payment-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for payment-related actions.
 */
export const paymentSources = (craftClient: Client) => {
  /**
   * Adds a new payment source (action: payment-sources/add).
   * @param paymentSourceData - Data to create the payment source.
   * @returns The server response.
   */
  const addPaymentSource = async (
    paymentSourceData: AddPaymentSourceData
  ): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/payment-sources/add',
      paymentSourceData
    );
  };

  /**
   * Sets a primary payment source (action: payment-sources/set-primary-payment-source).
   * @param paymentSourceData - Data to set the primary payment source.
   * @returns The server response.
   */
  const setPrimaryPaymentSource = async (
    paymentSourceData: SetPrimaryPaymentSourceData
  ): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/payment-sources/set-primary-payment-source',
      paymentSourceData
    );
  };

  /**
   * Deletes a payment source (action: payment-sources/delete).
   * @param paymentSourceData - Data to delete the payment source.
   * @returns The server response.
   */
  const deletePaymentSource = async (
    paymentData: DeletePaymentSourceData
  ): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/payment-sources/delete',
      paymentData
    );
  };

  return {
    addPaymentSource,
    setPrimaryPaymentSource,
    deletePaymentSource,
  };
};
