import { getCookie } from '../utils/cookie';

interface SessionInfo {
  csrfTokenValue: string;
}
interface FetchOptions {
  accept?: string; // Specifies the type of content accepted
  contentType?: string; // Specifies the type of content sent
  [header: string]: string | undefined; // Additional custom headers
}
export interface Client {
  /**
   * Makes a POST request with the CSRF token.
   * @param endpoint - The endpoint to send the request to.
   * @param payload - The payload to send.
   * @param options - Options for the request.
   * @returns The response from the server.
   */
  post: (
    endpoint: string,
    payload?: any,
    options?: FetchOptions
  ) => Promise<any>;

  /**
   * Makes a GET request.
   * @param endpoint - The endpoint to send the request to.
   * @param params - Query string parameters as a record of keys and values.
   * @param options - Options for the request.
   * @returns The response from the server.
   */
  get: (
    endpoint: string,
    params?: Record<string, any>,
    options?: FetchOptions
  ) => Promise<any>;
}

/**
 * Client API for interacting with Craft CMS.
 * @param apiBaseUrl - The base URL of the API.
 * @returns An instance of the client.
 */
export const client = ({ apiBaseUrl }: { apiBaseUrl: string }): Client => {
  if (!apiBaseUrl.endsWith('/')) {
    apiBaseUrl += '/'; // Ensure the base URL ends with a slash
  }

  const cookieName = 'CRAFT_CSRF_TOKEN';
  let csrfToken: string | null = getCookie(cookieName, apiBaseUrl); // Try to get the CSRF token from cookies

  /**
   * Fetches the CSRF token from the server if not available in cookies.
   * @returns The CSRF token.
   */
  const fetchCsrfToken = async (): Promise<string> => {
    const response = await fetch(`${apiBaseUrl}actions/users/session-info`, {
      headers: { Accept: 'application/json' },
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(errorData);
      throw new Error('Failed to fetch CSRF token');
    }

    const session: SessionInfo = await response.json();
    csrfToken = session.csrfTokenValue; // Save the CSRF token
    return csrfToken;
  };

  /**
   * Makes a POST request with the CSRF token.
   * @param endpoint - The endpoint to send the request to.
   * @param payload - The payload to send.
   * @param options - Options for the request, such as headers.
   * @returns The response from the server.
   */
  const post = async (
    endpoint: string,
    payload?: any,
    options: FetchOptions = {}
  ): Promise<any> => {
    try {
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      const {
        accept = 'application/json',
        contentType = 'application/json',
        ...headers
      } = options;
      const body = payload !== undefined ? JSON.stringify(payload) : undefined;

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          Accept: accept,
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          ...headers,
        },
        body,
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(errorData.message || 'API request failed');

        // Handle CSRF token expiration or invalidity
        if (
          response.status === 400 &&
          errorData.message === 'Unable to verify your data submission.'
        ) {
          console.warn('CSRF token expired or invalid. Refreshing token...');
          csrfToken = null; // Reset the CSRF token
          return await post(endpoint, payload); // Retry the request after refreshing the token
        }

        return errorData;
      }

      if (accept === 'application/pdf') {
        return await response.blob(); // Return the file as Blob
      }

      return await response.json();
    } catch (error) {
      console.error('Error making POST request:', error);
      throw error;
    }
  };

  /**
   * Makes a GET request (CSRF token is not required for GET requests).
   * @param endpoint - The endpoint to send the request to.
   * @param params - Query string parameters as a record of keys and values.
   * @param options - Options for the request, such as headers.
   * @returns The response from the server.
   */
  const get = async (
    endpoint: string,
    params: Record<string, any> = {},
    options: FetchOptions = {}
  ): Promise<any> => {
    try {
      const { accept = 'application/json', ...headers } = options;
      const url = new URL(endpoint, apiBaseUrl);

      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key])); // Convert values to strings
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: accept,
          'X-Requested-With': 'XMLHttpRequest',
          ...headers,
        },
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(errorData.message || 'API request failed');
        return errorData;
      }

      if (accept === 'application/pdf') {
        return await response.blob(); // Return the file as Blob
      }

      return await response.json();
    } catch (error) {
      console.error('Error making GET request:', error);
      throw error;
    }
  };

  return {
    post,
    get,
  };
};
