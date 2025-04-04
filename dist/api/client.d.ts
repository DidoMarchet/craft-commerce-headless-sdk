interface FetchOptions {
    accept?: string;
    contentType?: string;
    [header: string]: any;
}
export interface Client {
    /**
     * Makes a POST request with the CSRF token.
     * @param endpoint - The endpoint to send the request to.
     * @param payload - The payload to send.
     * @param options - Request options.
     * @returns The server response.
     */
    post: (endpoint: string, payload?: any, options?: FetchOptions) => Promise<any>;
    /**
     * Makes a GET request.
     * @param endpoint - The endpoint to send the request to.
     * @param params - Query string parameters as a key/value record.
     * @param options - Request options.
     * @returns The server response.
     */
    get: (endpoint: string, params?: Record<string, any>, options?: FetchOptions) => Promise<any>;
}
declare let apiBaseUrl: string;
/**
 * Client API for interacting with Craft CMS APIs.
 * @param apiBaseUrlParam - The base URL of the API.
 * @returns An instance of the client.
 */
export declare const client: ({ apiBaseUrl: baseUrl }: {
    apiBaseUrl: string;
}) => Client;
export {};
