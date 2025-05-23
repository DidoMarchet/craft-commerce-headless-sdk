/*******************************************************
 * apiClient.ts
 *
 * Description:
 * A configurable client for interacting with Craft CMS APIs
 * with enhanced error handling and optional logging.
 *******************************************************/
/**
 * A stricter error data interface.
 * Adjust it to match your actual API error structure.
 */
export interface CraftCommerceSdkErrorData {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
    [key: string]: any;
}
/**
 * A session info interface for the CSRF token response.
 */
export interface SessionInfo {
    csrfTokenValue: string;
}
/**
 * Options for controlling log behavior, specifying the accepted/sent content type, etc.
 */
export interface FetchOptions {
    accept?: string;
    contentType?: string;
    [header: string]: any;
}
/**
 * Configuration for enabling or disabling logs and controlling retries.
 */
export interface ClientConfig {
    apiBaseUrl: string;
    enableLogging?: boolean;
    maxRetries?: number;
}
/**
 * Our custom API Error class for non-2xx responses.
 * Now includes endpoint, method, and the number of retries performed.
 */
export declare class CraftCommerceSdkError extends Error {
    status: number;
    data: CraftCommerceSdkErrorData;
    endpoint: string;
    method: string;
    retryCount: number;
    constructor(message: string, status: number, data: CraftCommerceSdkErrorData, endpoint: string, method: string, retryCount: number);
}
/**
 * Our final client interface with post and get methods.
 */
export interface Client {
    post: (endpoint: string, payload?: any, options?: FetchOptions) => Promise<any>;
    get: (endpoint: string, params?: Record<string, any>, options?: FetchOptions) => Promise<any>;
}
/**
 * The main exported factory function to create our client.
 * Encapsulates configuration variables within the client instance.
 */
export declare const client: (config: ClientConfig) => Client;
