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
interface ApiErrorData {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
    [key: string]: any;
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
interface ClientConfig {
    apiBaseUrl: string;
    enableLogging?: boolean;
    maxRetries?: number;
}
/**
 * Our custom API Error class for non-2xx responses.
 * Now includes endpoint, method, and the number of retries performed.
 */
export declare class ApiError extends Error {
    status: number;
    data: ApiErrorData;
    endpoint: string;
    method: string;
    retryCount: number;
    constructor(message: string, status: number, data: ApiErrorData, endpoint: string, method: string, retryCount: number);
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
export declare function client(config: ClientConfig): Client;
export {};
