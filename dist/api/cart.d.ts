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
    billingAddress?: Record<string, any>;
    billingAddressId?: number;
    billingAddressSameAsShipping?: boolean;
    clearAddresses?: boolean;
    clearBillingAddress?: boolean;
    clearLineItems?: boolean;
    clearNotices?: boolean;
    clearShippingAddress?: boolean;
    couponCode?: string;
    email?: string;
    estimatedBillingAddress?: object;
    estimatedBillingAddressSameAsShipping?: boolean;
    estimatedShippingAddress?: object;
    fields?: Record<string, any>;
    forceSave?: boolean;
    gatewayId?: number;
    lineItems?: Record<number, {
        qty?: number;
        options?: Record<string, any>;
        note?: string;
        remove?: boolean;
    }>;
    makePrimaryBillingAddress?: boolean;
    makePrimaryShippingAddress?: boolean;
    number?: string;
    paymentCurrency?: string;
    paymentSourceId?: number;
    purchasableId?: number;
    purchasables?: Array<{
        id: number;
        qty?: number;
        options?: Record<string, any>;
        note?: string;
    }>;
    registerUserOnOrderComplete?: boolean;
    saveAddressesOnOrderComplete?: boolean;
    saveBillingAddressOnOrderComplete?: boolean;
    saveShippingAddressOnOrderComplete?: boolean;
    shippingAddress?: Record<string, any>;
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
    getCart: () => Promise<any>;
    loadCart: (cartData: LoadCartData) => Promise<any>;
    forgetCart: () => Promise<any>;
    updateCart: (cartData: UpdateCartData) => Promise<any>;
};
