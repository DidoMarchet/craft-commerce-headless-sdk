/**
 * Validates if the given domain is in a correct format.
 * @param domain - The domain to validate.
 * @returns True if the domain is valid, false otherwise.
 */
const validateDomain = (domain: string): boolean =>
  /^[a-zA-Z0-9.-]+$/.test(domain);

/**
 * Handles cookie operations such as setting or deleting a cookie.
 * @param action - The action to perform ('set' or 'delete').
 * @param name - The name of the cookie.
 * @param value - The value of the cookie (use an empty string for delete).
 * @param domain - The domain for the cookie.
 * @returns The cookie value if set successfully, null otherwise.
 */
const handleCookie = (
  action: 'set' | 'delete',
  name: string,
  value: string,
  domain: string
): string | null => {
  if (!validateDomain(domain)) {
    return null; // Invalid domain, do nothing
  }

  const expires = action === 'set' ? 'expires=0' : 'Max-Age=-99999999';
  const cookieString = `${name}=${value}; path=/; ${expires}; domain=${domain}; Secure; SameSite=None;`;

  document.cookie = cookieString;

  if (action === 'set') {
    return value; // Return value for 'set' action
  }
  return null; // Return null for 'delete' action
};

/**
 * Sets a cookie with a specified name, value, and domain.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param domain - The domain for the cookie.
 * @returns The value of the cookie if set successfully, null otherwise.
 */
export const setCookie = (
  name: string,
  value: string,
  domain: string
): string | null => handleCookie('set', name, value, domain);

/**
 * Deletes a cookie with a specified name and domain.
 * @param name - The name of the cookie.
 * @param domain - The domain for the cookie.
 * @returns Null after deleting the cookie.
 */
export const deleteCookie = (name: string, domain: string): null => {
  handleCookie('delete', name, '', domain);
  return null;
};

/**
 * Overwrites a cookie's value by setting a new value for it.
 * @param name - The name of the cookie to overwrite.
 * @param newTokenValue - The new value to set for the cookie.
 * @param domain - The domain for the cookie.
 * @returns The new value of the cookie if set successfully, null otherwise.
 */
export const overwriteCsrfToken = (
  name: string,
  newTokenValue: string,
  domain: string
): string | null => setCookie(name, newTokenValue, domain);

/**
 * Retrieves the value of a cookie for a specified name and domain.
 * @param name - The name of the cookie to retrieve.
 * @param domain - The domain of the cookie.
 * @returns The value of the cookie if found, null otherwise.
 */
export const getCookie = (name: string, domain: string): string | null => {
  if (!validateDomain(domain)) {
    return null; // Invalid domain, do nothing
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};
