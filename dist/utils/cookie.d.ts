/**
 * Sets a cookie with a specified name, value, and domain.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param domain - The domain for the cookie.
 * @returns The value of the cookie if set successfully, null otherwise.
 */
export declare const setCookie: (name: string, value: string, domain: string) => string | null;
/**
 * Deletes a cookie with a specified name and domain.
 * @param name - The name of the cookie.
 * @param domain - The domain for the cookie.
 * @returns Null after deleting the cookie.
 */
export declare const deleteCookie: (name: string, domain: string) => null;
/**
 * Overwrites a cookie's value by setting a new value for it.
 * @param name - The name of the cookie to overwrite.
 * @param newTokenValue - The new value to set for the cookie.
 * @param domain - The domain for the cookie.
 * @returns The new value of the cookie if set successfully, null otherwise.
 */
export declare const overwriteCsrfToken: (name: string, newTokenValue: string, domain: string) => string | null;
/**
 * Retrieves the value of a cookie for a specified name and domain.
 * @param name - The name of the cookie to retrieve.
 * @param domain - The domain of the cookie.
 * @returns The value of the cookie if found, null otherwise.
 */
export declare const getCookie: (name: string, domain: string) => string | null;
