/**
 * Import necessary modules for handling different Craft CMS functionalities.
 */
import { client } from './api/client';
import { users } from './api/users';
import { cart } from './api/cart';
import { paymentSources } from './api/payment-source';
import { payment } from './api/payment';
import { subscriptions } from './api/subscriptions';

/**
 * Configuration interface for initializing the SDK.
 */
export interface CraftCommerceHeadlessSdkConfig {
  /** Base URL of the Craft CMS API */
  apiBaseUrl: string;
  /** Optional flag to enable/disable logging (default: false) */
  enableLogging?: boolean;
  /** Maximum number of retries on CSRF errors (default defined in client) */
  maxRetries?: number;
}

/**
 * Initializes the Craft CMS Headless client with the provided base URL and configuration.
 *
 * @param config - Configuration object containing apiBaseUrl, enableLogging, and maxRetries.
 * @returns An object exposing the client and associated functionalities.
 */
export const craftCommerceHeadlessSdk = ({
  apiBaseUrl,
  enableLogging = false,
  maxRetries,
}: CraftCommerceHeadlessSdkConfig) => {
  // Force enableLogging to always be a boolean
  const _enableLogging = !!enableLogging;

  // Initialize the client with the complete configuration
  const craftClient = client({
    apiBaseUrl,
    enableLogging: _enableLogging,
    maxRetries,
  });

  // Initialize functionalities from various modules using the configured client
  const userFunctions = users(craftClient);
  const cartFunctions = cart(craftClient);
  const paymentSourcesFunctions = paymentSources(craftClient);
  const paymentFunctions = payment(craftClient);
  const subscriptionFunctions = subscriptions(craftClient);

  return {
    client: craftClient,
    users: userFunctions,
    cart: cartFunctions,
    paymentSources: paymentSourcesFunctions,
    payment: paymentFunctions,
    subscriptions: subscriptionFunctions,
  };
};

// Re-export modules (both types and functions)
export * from './api/users';
export * from './api/cart';
export * from './api/payment-source';
export * from './api/payment';
export * from './api/subscriptions';
