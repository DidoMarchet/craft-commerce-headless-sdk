import { Client } from './client';

export interface SubscribeData {
  planUid: string;
  fields?: Record<string, any>;
  fieldsLocation?: string;
  [key: string]: any;
}

export interface CancelData {
  subscriptionUid: string;
  [key: string]: any; // Additional parameters specific to the gateway
}

export interface SwitchPlanData {
  subscriptionUid: string;
  planUid: string;
  [key: string]: any; // Additional parameters specific to the gateway
}

export interface ReactivateData {
  subscriptionUid: string;
}

/**
 * Subscription-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for subscription-related actions.
 */
export const subscriptions = (craftClient: Client) => {
  /**
   * Starts a new subscription (action: subscriptions/subscribe).
   * @param subscriptionData - Data to create the subscription.
   * @returns The server response.
   */
  const subscribe = async (subscriptionData: SubscribeData): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/subscriptions/subscribe',
      subscriptionData
    );
  };

  /**
   * Cancels an active subscription (action: subscriptions/cancel).
   * @param subscriptionData - Data to cancel the subscription.
   * @returns The server response.
   */
  const cancel = async (subscriptionData: CancelData): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/subscriptions/cancel',
      subscriptionData
    );
  };

  /**
   * Switches the plan of an active subscription (action: subscriptions/switch).
   * @param subscriptionData - Data to switch the subscription plan.
   * @returns The server response.
   */
  const switchPlan = async (subscriptionData: SwitchPlanData): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/subscriptions/switch',
      subscriptionData
    );
  };

  /**
   * Reactivates a canceled subscription (action: subscriptions/reactivate).
   * @param subscriptionData - Data to reactivate the subscription.
   * @returns The server response.
   */
  const reactivate = async (subscriptionData: ReactivateData): Promise<any> => {
    return await craftClient.post(
      'actions/commerce/subscriptions/reactivate',
      subscriptionData
    );
  };

  return {
    subscribe,
    cancel,
    switchPlan,
    reactivate,
  };
};
