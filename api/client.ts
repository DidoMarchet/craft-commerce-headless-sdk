/*******************************************************
 * apiClient.ts
 *
 * Description:
 * A configurable client for interacting with Craft CMS APIs
 * with enhanced error handling and optional logging.
 *******************************************************/

import { getCookie } from '../utils/cookie';

/**
 * A stricter error data interface.
 * Adjust it to match your actual API error structure.
 */
export interface CraftCommerceSdkErrorData {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: any; // Fallback for unexpected fields
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
  accept?: string; // e.g., 'application/json'
  contentType?: string; // e.g., 'application/json'
  [header: string]: any; // Additional custom headers
}

/**
 * Configuration for enabling or disabling logs and controlling retries.
 */
export interface ClientConfig {
  apiBaseUrl: string; // Base URL of your Craft CMS API
  enableLogging?: boolean; // If true, logs to console
  maxRetries?: number; // Max number of times to retry on CSRF errors
}

/**
 * Our custom API Error class for non-2xx responses.
 * Now includes endpoint, method, and the number of retries performed.
 */
export class CraftCommerceSdkError extends Error {
  status: number;
  data: CraftCommerceSdkErrorData;
  endpoint: string;
  method: string;
  retryCount: number;

  constructor(
    message: string,
    status: number,
    data: CraftCommerceSdkErrorData,
    endpoint: string,
    method: string,
    retryCount: number
  ) {
    super(message);
    this.name = 'CraftCommerceSdkError';
    this.status = status;
    this.data = data;
    this.endpoint = endpoint;
    this.method = method;
    this.retryCount = retryCount;
    // Maintain the correct prototype chain
    Object.setPrototypeOf(this, CraftCommerceSdkError.prototype);
  }
}

/**
 * Our final client interface with post and get methods.
 */
export interface Client {
  post: (
    endpoint: string,
    payload?: any,
    options?: FetchOptions
  ) => Promise<any>;

  get: (
    endpoint: string,
    params?: Record<string, any>,
    options?: FetchOptions
  ) => Promise<any>;
}

/*******************************************************
 * Implementation details
 *******************************************************/

/**
 * Logs messages to the console if logging is enabled.
 */
function log(enableLogging: boolean, ...args: any[]): void {
  if (enableLogging) {
    console.log(...args);
  }
}

/**
 * Ensures that the base URL ends with a slash.
 */
function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url : url + '/';
}

/**
 * Attempts to fetch the CSRF token from cookies or from the server.
 */
async function fetchCsrfToken(
  baseUrl: string,
  enableLogging: boolean
): Promise<string> {
  const cookieName = 'CRAFT_CSRF_TOKEN';
  const csrfToken = getCookie(cookieName, baseUrl);
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(`${baseUrl}actions/users/session-info`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData: CraftCommerceSdkErrorData = await response
      .json()
      .catch(() => ({}));
    const errorMessage =
      errorData.message ||
      `Failed to fetch CSRF token with status ${response.status}`;
    throw new CraftCommerceSdkError(
      errorMessage,
      response.status,
      errorData,
      'actions/users/session-info',
      'GET',
      0
    );
  }

  const session: SessionInfo = await response.json();
  return session.csrfTokenValue;
}

/**
 * Parses a Fetch API error response and converts it to a CraftCommerceSdkError instance.
 *
 * @async
 * @param {Response} response The Fetch API response.
 * @param {string} endpoint The URL used in the Fetch API request.
 * @param {string} method The HTTP method used in the Fetch API request.
 * @param {number} retryCount The number of retry requests prior to handling the error.
 * @returns {Promise<CraftCommerceSdkError>}
 */
async function errorResponseToSdkError(
  response: Response,
  endpoint: string,
  method: string,
  retryCount: number
): Promise<CraftCommerceSdkError> {
  let errorMessage = 'API request failed';
  let errorData: CraftCommerceSdkErrorData = {};
  try {
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.errors) {
        errorMessage = Object.values(errorData.errors).flat().join(', ');
      } else {
        errorMessage = errorData.message || errorMessage;
      }
    } else {
      // If not JSON, use plain text
      errorMessage =
        (await response.text()) || response.statusText || errorMessage;
    }
  } catch {
    errorMessage = response.statusText || errorMessage;
  }
  errorMessage = `(${response.status}) ${errorMessage}`;
  return new CraftCommerceSdkError(
    errorMessage,
    response.status,
    errorData,
    endpoint,
    method,
    retryCount
  );
}

/**
 * The main exported factory function to create our client.
 * Encapsulates configuration variables within the client instance.
 */
export const client = (config: ClientConfig): Client => {
  // Local configuration variables for this client instance
  const localEnableLogging = !!config.enableLogging;
  const localMaxRetries = config.maxRetries ?? 1;
  const localBaseUrl = normalizeBaseUrl(config.apiBaseUrl);
  let localCsrfToken: string | null = null;

  log(localEnableLogging, 'Craft Commerce using base URL:', localBaseUrl);

  /**
   * POST method implementation.
   * Uses CSRF token, handles retries, and wraps errors in CraftCommerceSdkError.
   */
  const post = async (
    endpoint: string,
    payload?: any,
    options: FetchOptions = {},
    retryCount: number = 0
  ): Promise<any> => {
    try {
      if (!localCsrfToken) {
        localCsrfToken = await fetchCsrfToken(localBaseUrl, localEnableLogging);
      }

      const {
        accept = 'application/json',
        contentType = 'application/json',
        ...headers
      } = options;
      const body = payload !== undefined ? JSON.stringify(payload) : undefined;

      log(localEnableLogging, 'Craft Commerce POST request:', endpoint, {
        retryCount,
        body,
      });

      const response = await fetch(`${localBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          Accept: accept,
          'X-CSRF-Token': localCsrfToken!,
          'X-Requested-With': 'XMLHttpRequest',
          ...headers,
        },
        body,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorData: CraftCommerceSdkErrorData = {};
        const contentTypeHeader = response.headers.get('Content-Type') || '';
        if (contentTypeHeader.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        } else {
          const text = await response.text();
          errorData = { message: text };
        }
        log(localEnableLogging, 'Craft Commerce POST error data:', errorData);

        if (
          retryCount < localMaxRetries &&
          response.status === 400 &&
          errorData.message === 'Unable to verify your data submission.'
        ) {
          console.warn('CSRF token invalid. Retrying request...');
          localCsrfToken = null;
          return post(endpoint, payload, options, retryCount + 1);
        }

        throw new CraftCommerceSdkError(
          errorData.message ||
            `API request failed with status ${response.status}`,
          response.status,
          errorData,
          endpoint,
          'POST',
          retryCount
        );
      }

      if (accept === 'application/pdf') {
        return await response.blob();
      }

      // Retrieve response body text to handle empty responses
      const text = await response.text();
      if (!text) {
        throw new CraftCommerceSdkError(
          `(${response.status}) Empty response`,
          response.status,
          {},
          endpoint,
          'POST',
          retryCount
        );
      }
      try {
        return JSON.parse(text);
      } catch {
        // If parsing fails, return the plain text
        return text;
      }
    } catch (error: any) {
      log(localEnableLogging, 'Craft Commerce POST caught error:', error);
      if (!(error instanceof CraftCommerceSdkError)) {
        throw new CraftCommerceSdkError(
          error.message || 'Unknown error',
          0,
          {},
          endpoint,
          'POST',
          retryCount
        );
      }
      throw error;
    }
  };

  /**
   * GET method implementation.
   * Constructs a query string from parameters and handles errors consistently.
   */
  const get = async (
    endpoint: string,
    params: Record<string, any> = {},
    options: FetchOptions = {}
  ): Promise<any> => {
    try {
      const { accept = 'application/json', ...headers } = options;
      const url = new URL(endpoint, localBaseUrl);

      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });

      log(localEnableLogging, 'Craft Commerce GET request:', url.toString());

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
        throw await errorResponseToSdkError(response, endpoint, 'GET', 0);
      }

      if (accept === 'application/pdf') {
        return await response.blob();
      }

      const text = await response.text();
      if (!text) {
        throw new CraftCommerceSdkError(
          `(${response.status}) Empty response`,
          response.status,
          {},
          endpoint,
          'GET',
          0
        );
      }
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (error: any) {
      log(localEnableLogging, 'Craft Commerce GET caught error:', error);
      if (!(error instanceof CraftCommerceSdkError)) {
        throw new CraftCommerceSdkError(
          error.message || 'Unknown error',
          0,
          {},
          endpoint,
          'GET',
          0
        );
      }
      throw error;
    }
  };

  return { post, get };
};
