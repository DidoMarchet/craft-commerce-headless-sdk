interface FetchOptions {
    accept?: string;
    contentType?: string;
    [header: string]: string | undefined;
}
export interface Client {
    /**
     * Makes a POST request with the CSRF token.
     * @param endpoint - The endpoint to send the request to.
     * @param payload - The payload to send.
     * @param options - Options for the request.
     * @returns The response from the server.
     */
    post: (endpoint: string, payload?: any, options?: FetchOptions) => Promise<any>;
    /**
     * Makes a GET request.
     * @param endpoint - The endpoint to send the request to.
     * @param params - Query string parameters as a record of keys and values.
     * @param options - Options for the request.
     * @returns The response from the server.
     */
    get: (endpoint: string, params?: Record<string, any>, options?: FetchOptions) => Promise<any>;
}
/**
 * Client API for interacting with Craft CMS.
 * @param apiBaseUrl - The base URL of the API.
 * @returns An instance of the client.
 */
export declare const client: ({ apiBaseUrl }: {
    apiBaseUrl: string;
}) => Client;
export {};
