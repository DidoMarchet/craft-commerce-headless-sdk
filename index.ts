/**
 * Importing necessary modules for handling different Craft CMS functionalities.
 */
import { client } from './api/client'; // Import client and its type
import { users } from './api/users'; // Import functions and types
import { cart } from './api/cart'; // Import cart functions
import { paymentSources } from './api/payment-source'; // Import payment functions
import { payment } from './api/payment'; // Import payment functions
import { subscriptions } from './api/subscriptions'; // Import subscription functions

/**
 * Initializes the Craft CMS Headless client with the provided API base URL.
 * @param apiBaseUrl - The base URL of the Craft CMS API.
 * @returns An object exposing the initialized client and associated functionalities.
 */

export const craftCommerceHeadlessSdk = ({
  apiBaseUrl,
}: {
  apiBaseUrl: string;
}) => {
  // Initialize the client with the base URL
  const craftClient = client({ apiBaseUrl });

  // Pass the initialized client to the user functions
  const userFunctions = users(craftClient);

  // Pass the initialized client to the cart functions
  const cartFunctions = cart(craftClient);

  // Pass the initialized client to the payment sources functions
  const paymentSourcesFunctions = paymentSources(craftClient);

  // Pass the initialized client to the payment functions
  const paymentFunctions = payment(craftClient);

  // Pass the initialized client to the subscription functions
  const subscriptionFunctions = subscriptions(craftClient);

  return {
    client: craftClient, // Expose the client (if needed)
    users: userFunctions, // Expose the user functions
    cart: cartFunctions, // Expose the cart functions
    paymentSources: paymentSourcesFunctions, // Expose the payment sources functions
    payment: paymentFunctions, // Expose the payment functions
    subscriptions: subscriptionFunctions, // Expose the subscription functions
  };
};
