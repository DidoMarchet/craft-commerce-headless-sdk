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
    addressId: number;
}
/**
 * User-related API client.
 * @param craftClient - The Craft CMS client.
 * @returns The API functions for user-related actions.
 */
export declare const users: (craftClient: Client) => {
    loginUser: (userData: UserLoginData) => Promise<any>;
    saveUser: (userData: UserSaveData) => Promise<any>;
    uploadUserPhoto: (userData: UserPhotoData) => Promise<any>;
    sendPasswordResetEmail: (userData: PasswordResetData) => Promise<any>;
    setPassword: (userData: SetPasswordData) => Promise<any>;
    saveAddress: (addressData: AddressData) => Promise<any>;
    deleteAddress: (addressData: DeleteAddressData) => Promise<any>;
    getSessionInfo: () => Promise<any>;
};
