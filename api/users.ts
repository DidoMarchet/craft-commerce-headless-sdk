import { Client } from './client';

/**
 * Data model for user-related actions.
 */
export interface AddressData {
  addressId?: number;
  userId?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  countryCode: string;
  administrativeArea?: string;
  locality?: string;
  dependentLocality?: string;
  postalCode?: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  organization?: string;
  organizationTaxId?: string;
  latitude?: number;
  longitude?: number;
  isPrimaryBilling?: boolean;
  isPrimaryShipping?: boolean;
  fields?: Record<string, any>;
  fieldsLocation?: string;
}

export interface UserLoginData {
  loginName: string;
  password: string;
  rememberMe?: 0 | 1;
}

export interface UserSaveData {
  currentPassword?: string;
  email?: string;
  fieldsLocation?: string;
  fields?: Record<string, any>;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  newPassword?: string;
  passwordResetRequired?: 0 | 1;
  password?: string;
  photo?: File;
  sendVerificationEmail?: 0 | 1;
  userId?: number;
  userVariable?: string;
  username?: string;
}

export interface UserPhotoData {
  userId: string;
  photo: File;
}

export interface PasswordResetData {
  loginName?: string;
  userId?: number;
}

export interface SetPasswordData {
  code: string;
  id: string;
  newPassword: string;
}

export interface DeleteAddressData {
  addressId: number; // ID of the payment source
}

/**
 * User-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for user-related actions.
 */
export const users = (craftClient: Client) => {
  /**
   * Login a user (action: users/login).
   * @param userData - User login data.
   * @returns The server response.
   */
  const loginUser = async (userData: UserLoginData): Promise<any> => {
    return await craftClient.post('actions/users/login', userData);
  };

  /**
   * Save or update a user (action: users/save-user).
   * @param userData - User save data.
   * @returns The server response.
   */
  const saveUser = async (userData: UserSaveData): Promise<any> => {
    return await craftClient.post('actions/users/save-user', userData);
  };

  /**
   * Upload a user's photo (action: users/upload-user-photo).
   * @param userData - User photo data.
   * @returns The server response.
   */
  const uploadUserPhoto = async (userData: UserPhotoData): Promise<any> => {
    return await craftClient.post('actions/users/upload-user-photo', userData);
  };

  /**
   * Send a password reset email (action: users/send-password-reset-email).
   * @param userData - Password reset request data.
   * @returns The server response.
   */
  const sendPasswordResetEmail = async (
    userData: PasswordResetData
  ): Promise<any> => {
    return await craftClient.post(
      'actions/users/send-password-reset-email',
      userData
    );
  };

  /**
   * Set a new password (action: users/set-password).
   * @param userData - New password data.
   * @returns The server response.
   */
  const setPassword = async (userData: SetPasswordData): Promise<any> => {
    return await craftClient.post('actions/users/set-password', userData);
  };

  /**
   * Save or update an address (action: users/save-address).
   * @param addressData - Address data to save.
   * @returns The server response.
   */
  const saveAddress = async (addressData: AddressData): Promise<any> => {
    return await craftClient.post('actions/users/save-address', addressData);
  };

  /**
   * Delete an address (action: users/delete-address).
   * @param addressData - Address data to delete.
   * @returns The server response.
   */
  const deleteAddress = async (
    addressData: DeleteAddressData
  ): Promise<any> => {
    return await craftClient.post('actions/users/delete-address', addressData);
  };

  /**
   * Get current session info (action: users/session-info).
   * @returns The session information.
   */
  const getSessionInfo = async (): Promise<any> => {
    return await craftClient.get('actions/users/session-info');
  };

  return {
    loginUser,
    saveUser,
    uploadUserPhoto,
    sendPasswordResetEmail,
    setPassword,
    saveAddress,
    deleteAddress,
    getSessionInfo,
  };
};
