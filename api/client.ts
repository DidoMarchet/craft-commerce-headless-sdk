import { getCookie } from '../utils/cookie';

interface SessionInfo {
  csrfTokenValue: string;
}

interface FetchOptions {
  accept?: string;       // Specifies the accepted content type (e.g., 'application/json')
  contentType?: string;  // Specifies the content type sent (e.g., 'application/json')
  [header: string]: any; // Additional custom headers
}

export interface Client {
  /**
   * Makes a POST request with the CSRF token.
   * @param endpoint - The endpoint to send the request to.
   * @param payload - The payload to send.
   * @param options - Request options.
   * @returns The server response.
   */
  post: (
    endpoint: string,
    payload?: any,
    options?: FetchOptions
  ) => Promise<any>;

  /**
   * Makes a GET request.
   * @param endpoint - The endpoint to send the request to.
   * @param params - Query string parameters as a key/value record.
   * @param options - Request options.
   * @returns The server response.
   */
  get: (
    endpoint: string,
    params?: Record<string, any>,
    options?: FetchOptions
  ) => Promise<any>;
}

/**
 * Custom API Error class to represent non-2xx responses.
 */
class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;

    // Maintain proper prototype chain (important for older browsers)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Maximum number of retries for token refresh
const MAX_RETRIES = 1;

// Variable to store the CSRF token
let csrfToken: string | null = null;

// Replace with your actual API base URL
let apiBaseUrl = 'YOUR_API_BASE_URL';
if (!apiBaseUrl.endsWith('/')) {
  apiBaseUrl += '/';
}

/**
 * Fetches the CSRF token from the server if not available in cookies.
 * @returns The CSRF token.
 */
const fetchCsrfToken = async (): Promise<string> => {
  const cookieName = 'CRAFT_CSRF_TOKEN';
  // Try to obtain the token from cookies
  csrfToken = getCookie(cookieName, apiBaseUrl);
  if (csrfToken) return csrfToken;

  // Otherwise, fetch the token from the server
  const response = await fetch(`${apiBaseUrl}actions/users/session-info`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Failed to fetch CSRF token with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, errorData);
  }

  const session: SessionInfo = await response.json();
  csrfToken = session.csrfTokenValue;
  return csrfToken;
};

/**
 * Client API for interacting with Craft CMS APIs.
 * @param apiBaseUrlParam - The base URL of the API.
 * @returns An instance of the client.
 */
export const client = ({ apiBaseUrl: baseUrl }: { apiBaseUrl: string }): Client => {
  // Ensure base URL ends with a slash
  apiBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  /**
   * Makes a POST request with the CSRF token.
   * @param endpoint - The endpoint to send the request to.
   * @param payload - The payload to send.
   * @param options - Request options such as headers.
   * @param retryCount - Internal counter for retry attempts.
   * @returns The server response.
   */
  const post = async (
    endpoint: string,
    payload?: any,
    options: FetchOptions = {},
    retryCount: number = 0
  ): Promise<any> => {
    try {
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      const { accept = 'application/json', contentType = 'application/json', ...headers } = options;
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
        console.error(`API POST error (${endpoint}):`, errorData.message || 'API request failed');

        // Handle CSRF token expiration or invalidity
        if (
          retryCount < MAX_RETRIES &&
          response.status === 400 &&
          errorData.message === 'Unable to verify your data submission.'
        ) {
          console.warn('CSRF token expired or invalid. Retrying...');
          csrfToken = null; // Reset the CSRF token
          return await post(endpoint, payload, options, retryCount + 1);
        }

        const errorMessage = errorData.message || `API request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, errorData);
      }

      if (accept === 'application/pdf') {
        return await response.blob();
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Makes a GET request.
   * @param endpoint - The endpoint to send the request to.
   * @param params - Query string parameters as a key/value record.
   * @param options - Request options such as headers.
   * @returns The server response.
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
          url.searchParams.append(key, String(params[key]));
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: accept,
          'X-Requested-With': 'XMLHttpRequest',
          ...headers,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`API GET error (${endpoint}):`, await response.text());
        throw await parseErrorResponse(response);
      }

      if (accept === 'application/pdf') {
        return await response.blob();
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    post,
    get,
  };
};

/**
 * Helper function to parse error responses.
 * @param response - The Response object returned from fetch.
 * @returns An Error object with the extracted message.
 */
const parseErrorResponse = async (response: Response): Promise<Error> => {
  let errorMessage = 'API request failed';
  try {
    const errorData = await response.json();
    if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.errors) {
      if (typeof errorData.errors === 'object') {
        errorMessage = Object.values(errorData.errors).flat().join(', ');
      } else {
        errorMessage = errorData.errors;
      }
    } else {
      errorMessage = errorData.message || errorMessage;
    }
  } catch (jsonError) {
    const text = await response.text();
    errorMessage = text || response.statusText || errorMessage;
  }
  errorMessage = `(${response.status}) ${errorMessage}`;
  return new Error(errorMessage);
};
