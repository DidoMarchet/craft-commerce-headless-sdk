import { Client } from './client';
export interface CompleteCartData {
    forceSave?: boolean;
    number?: string;
    registerUserOnOrderComplete?: boolean;
}
export interface GetCartData {
    number?: string;
    forceSave?: boolean;
}
export interface LoadCartData {
    number?: string;
}
export interface UpdateCartData {
    billingAddress?: object;
    billingAddressId?: number;
    billingAddressSameAsShipping?: boolean;
    clearNotices?: boolean;
    clearLineItems?: boolean;
    couponCode?: string;
    email?: string;
    estimatedBillingAddress?: object;
    estimatedBillingAddressSameAsShipping?: boolean;
    estimatedShippingAddress?: object;
    fields?: Record<string, any>;
    forceSave?: boolean;
    gatewayId?: number;
    lineItems?: Array<object>;
    number?: string;
    paymentCurrency?: string;
    paymentSourceId?: number;
    purchasableId?: number;
    purchasables?: Array<number>;
    registerUserOnOrderComplete?: boolean;
    saveBillingAddressOnOrderComplete?: boolean;
    saveShippingAddressOnOrderComplete?: boolean;
    saveAddressesOnOrderComplete?: boolean;
    shippingAddress?: object;
    shippingAddressId?: number;
    shippingAddressSameAsBilling?: boolean;
    shippingMethodHandle?: string;
}
/**
 * Cart-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for cart-related actions.
 */
export declare const cart: (craftClient: Client) => {
    completeCart: (cartData: CompleteCartData) => Promise<any>;
    getCart: (cartData: GetCartData) => Promise<any>;
    loadCart: (cartData: LoadCartData) => Promise<any>;
    forgetCart: () => Promise<any>;
    updateCart: (cartData: UpdateCartData) => Promise<any>;
};
