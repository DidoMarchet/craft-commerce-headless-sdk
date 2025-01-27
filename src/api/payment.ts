import { Client } from './client';

export interface PayData {
  cancelUrl?: string;
  orderEmail?: string;
  gatewayId?: number;
  number?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentSourceId?: number;
  registerUserOnOrderComplete?: boolean;
  savePaymentSource?: boolean;
  saveBillingAddressOnOrderComplete?: boolean;
  saveShippingAddressOnOrderComplete?: boolean;
  saveAddressesOnOrderComplete?: boolean;
  [key: string]: any; // Additional parameters supported by the gateway form
}

export interface CompletePaymentData {
  commerceTransactionHash: string; // Required hash to verify payment
}

/**
 * Payment-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for payment-related actions.
 */
export const payment = (craftClient: Client) => {
  /**
   * Processes a payment for an order (action: payments/pay).
   * @param paymentData - Data to process the payment.
   * @returns The server response.
   */
  const pay = async (paymentData: PayData): Promise<any> => {
    return await craftClient.post('actions/commerce/payments/pay', paymentData);
  };

  /**
   * Processes the return of a customer from an off-site payment (action: payments/complete-payment).
   * @param paymentData - Data to complete the payment.
   * @returns The server response.
   */
  const completePayment = async (
    paymentData: CompletePaymentData
  ): Promise<any> => {
    return await craftClient.get(
      'actions/commerce/payments/complete-payment',
      paymentData
    );
  };

  return {
    completePayment,
    pay,
  };
};
