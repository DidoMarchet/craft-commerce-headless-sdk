/*******************************************************
 * apiClient.ts
 *
 * Description:
 * A configurable client for interacting with Craft CMS APIs
 * with enhanced error handling and optional logging.
 *******************************************************/

import { getCookie } from '../utils/cookie';

/**
 * Example of a stricter error data interface.
 * Adjust it to match your actual API error structure.
 */
interface ApiErrorData {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: any; // Fallback for unexpected fields
}

/**
 * A session info interface for the CSRF token response.
 */
interface SessionInfo {
  csrfTokenValue: string;
}

/**
 * Options for controlling log behavior, specifying the accepted/sent content type, etc.
 */
export interface FetchOptions {
  accept?: string;              // e.g., 'application/json'
  contentType?: string;         // e.g., 'application/json'
  [header: string]: any;        // Additional custom headers
}

/**
 * Configuration for enabling or disabling logs and controlling retries.
 */
interface ClientConfig {
  apiBaseUrl: string;           // Base URL of your Craft CMS API
  enableLogging?: boolean;      // If true, logs to console
  maxRetries?: number;          // Max number of times to retry on CSRF errors
}

/**
 * Our custom API Error class for non-2xx responses.
 * Now includes endpoint, method, and the number of retries performed.
 */
export class ApiError extends Error {
  status: number;
  data: ApiErrorData;
  endpoint: string;
  method: string;
  retryCount: number;

  constructor(
    message: string,
    status: number,
    data: ApiErrorData,
    endpoint: string,
    method: string,
    retryCount: number
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.endpoint = endpoint;
    this.method = method;
    this.retryCount = retryCount;

    // Maintain the correct prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
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
 * If the code in the method wants to log, it checks the
 * enableLogging flag. This helps avoid spamming logs.
 */
function log(enableLogging: boolean | undefined, ...args: any[]): void {
  if (enableLogging) {
    console.log(...args);
  }
}

/**
 * Global variables for storing the CSRF token and logging/retry configs.
 */
let csrfToken: string | null = null;
let enableLogging = false;
let maxRetries = 1;
let baseUrl = 'YOUR_API_BASE_URL'; // Default fallback

/**
 * A small helper to ensure we have a slash at the end of the base URL.
 */
function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url : url + '/';
}

/**
 * Attempt to fetch the CSRF token from either cookies or from the server.
 */
async function fetchCsrfToken(): Promise<string> {
  const cookieName = 'CRAFT_CSRF_TOKEN';

  // Try to get the token from cookies first
  if (!csrfToken) {
    csrfToken = getCookie(cookieName, baseUrl);
  }
  if (csrfToken) {
    return csrfToken;
  }

  // Otherwise, fetch it from the server
  const response = await fetch(`${baseUrl}actions/users/session-info`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData: ApiErrorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `Failed to fetch CSRF token with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, errorData, 'actions/users/session-info', 'GET', 0);
  }

  const session: SessionInfo = await response.json();
  csrfToken = session.csrfTokenValue;
  return csrfToken;
}

/**
 * Helper to parse non-OK responses in GET requests.
 * Returns an Error object (usually a built-in Error, but you could also throw ApiError).
 */
async function parseErrorResponse(response: Response): Promise<Error> {
  let errorMessage = 'API request failed';
  try {
    const errorData: ApiErrorData = await response.json();
    if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.errors) {
      // Combine all error messages
      errorMessage = Object.values(errorData.errors).flat().join(', ');
    } else {
      errorMessage = errorData.message || errorMessage;
    }
  } catch {
    const text = await response.text();
    errorMessage = text || response.statusText || errorMessage;
  }
  errorMessage = `(${response.status}) ${errorMessage}`;
  return new Error(errorMessage);
}

/*******************************************************
 * The main exported factory function to create our client
 *******************************************************/

// TODO: Gestire l'enable log e fare dei test
export function client(config: ClientConfig): Client {
  // Set up global logging / retry settings
  enableLogging = !!config.enableLogging;
  maxRetries = config.maxRetries ?? 1;
  baseUrl = normalizeBaseUrl(config.apiBaseUrl);

  // Log the configured base URL, if logging is enabled
  log(enableLogging, 'Craft Commerce using base URL:', baseUrl);

  /**
   * The POST method implementation.
   * Tries to use the CSRF token; if invalid, resets and retries up to maxRetries times.
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

      const {
        accept = 'application/json',
        contentType = 'application/json',
        ...headers
      } = options;
      const body = payload !== undefined ? JSON.stringify(payload) : undefined;

      log(enableLogging, 'Craft Commerce POST request:', endpoint, {
        retryCount,
        body,
      });

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          Accept: accept,
          'X-CSRF-Token': csrfToken!,
          'X-Requested-With': 'XMLHttpRequest',
          ...headers,
        },
        body,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData: ApiErrorData = await response.json().catch(() => ({}));

        log(enableLogging, 'Craft Commerce POST error data:', errorData);

        if (
          retryCount < maxRetries &&
          response.status === 400 &&
          errorData.message === 'Unable to verify your data submission.'
        ) {
          // Possibly a CSRF error, let's retry
          console.warn('CSRF token invalid. Retrying request...');
          csrfToken = null;
          return post(endpoint, payload, options, retryCount + 1);
        }

        const errorMessage =
          errorData.message ||
          `API request failed with status ${response.status}`;
        throw new ApiError(
          errorMessage,
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

      return await response.json();
    } catch (error) {
      log(enableLogging, 'Craft Commerce POST caught error:', error);
      throw error;
    }
  };

  /**
   * The GET method implementation.
   * Creates a query string from 'params' and throws an error on non-OK responses.
   */
  const get = async (
    endpoint: string,
    params: Record<string, any> = {},
    options: FetchOptions = {}
  ): Promise<any> => {
    try {
      const { accept = 'application/json', ...headers } = options;
      const url = new URL(endpoint, baseUrl);

      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });

      log(enableLogging, 'Craft Commerce GET request:', url.toString());

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
        const error = await parseErrorResponse(response);
        throw error;
      }

      if (accept === 'application/pdf') {
        return await response.blob();
      }

      return await response.json();
    } catch (error) {
      log(enableLogging, 'Craft Commerce GET caught error:', error);
      throw error;
    }
  };

  return { post, get };
}
