import { Client } from './client';
export interface AddPaymentSourceData {
    description?: string;
    gatewayId?: number;
    isPrimaryPaymentSource?: boolean;
    [key: string]: any;
}
export interface SetPrimaryPaymentSourceData {
    id: number;
}
export interface DeletePaymentSourceData {
    id: number;
}
/**
 * Payment-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for payment-related actions.
 */
export declare const paymentSources: (craftClient: Client) => {
    addPaymentSource: (paymentSourceData: AddPaymentSourceData) => Promise<any>;
    setPrimaryPaymentSource: (paymentSourceData: SetPrimaryPaymentSourceData) => Promise<any>;
    deletePaymentSource: (paymentData: DeletePaymentSourceData) => Promise<any>;
};
