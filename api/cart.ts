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
export const cart = (craftClient: Client) => {
  /**
   * Completes the cart (action: cart/complete).
   * @param cartData - Data to complete the cart.
   * @returns The server response.
   */
  const completeCart = async (cartData: CompleteCartData): Promise<any> => {
    return await craftClient.post('actions/commerce/cart/complete', cartData);
  };

  /**
   * Gets the current cart (action: cart/get-cart).
   * @param cartData - Data to get the cart.
   * @returns The server response.
   */
  const getCart = async (cartData: GetCartData): Promise<any> => {
    return await craftClient.get('actions/commerce/cart/get-cart', cartData);
  };

  /**
   * Loads a cart by order number (action: cart/load-cart).
   * @param cartData - Data to load the cart.
   * @returns The server response.
   */
  const loadCart = async (cartData: LoadCartData): Promise<any> => {
    return await craftClient.post('actions/commerce/cart/load-cart', cartData);
  };

  /**
   * Forgets the cart (action: cart/forget-cart).
   * @returns The server response.
   */
  const forgetCart = async (): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/cart/forget-cart',
      undefined,
      {
        accept: 'text/html',
      }
    );
  };

  /**
   * Updates the cart (action: cart/update-cart).
   * @param cartData - Data to update the cart.
   * @returns The server response.
   */
  const updateCart = async (cartData: UpdateCartData): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/cart/update-cart',
      cartData
    );
  };

  return {
    completeCart,
    getCart,
    loadCart,
    forgetCart,
    updateCart,
  };
};
