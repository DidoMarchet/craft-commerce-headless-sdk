import { Client } from './client';
export interface SubscribeData {
    planUid: string;
    fields?: Record<string, any>;
    fieldsLocation?: string;
    [key: string]: any;
}
export interface CancelData {
    subscriptionUid: string;
    [key: string]: any;
}
export interface SwitchPlanData {
    subscriptionUid: string;
    planUid: string;
    [key: string]: any;
}
export interface ReactivateData {
    subscriptionUid: string;
}
/**
 * Subscription-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for subscription-related actions.
 */
export declare const subscriptions: (craftClient: Client) => {
    subscribe: (subscriptionData: SubscribeData) => Promise<any>;
    cancel: (subscriptionData: CancelData) => Promise<any>;
    switchPlan: (subscriptionData: SwitchPlanData) => Promise<any>;
    reactivate: (subscriptionData: ReactivateData) => Promise<any>;
};
