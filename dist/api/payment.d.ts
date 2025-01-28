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
    [key: string]: any;
}
export interface CompletePaymentData {
    commerceTransactionHash: string;
}
/**
 * Payment-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for payment-related actions.
 */
export declare const payment: (craftClient: Client) => {
    completePayment: (paymentData: CompletePaymentData) => Promise<any>;
    pay: (paymentData: PayData) => Promise<any>;
};
