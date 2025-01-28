# Users SDK Documentation

The `users` module provides methods to interact with user-related actions in Craft CMS Commerce. It supports operations like logging in users, managing user profiles, handling addresses, and resetting passwords. All requests are handled securely using the `client` module.

For a comprehensive understanding of the underlying functionalities, refer to the [Craft CMS Controller Actions Documentation](https://craftcms.com/docs/5.x/reference/controller-actions.html).

### Key Features

- Login and manage users.
- Handle user addresses.
- Reset and update passwords.
- Upload user profile photos.

---

## Table of Contents

- [Installation](#installation)
- [Methods](#methods)
  - [loginUser](#loginuser)
  - [saveUser](#saveuser)
  - [uploadUserPhoto](#uploaduserphoto)
  - [sendPasswordResetEmail](#sendpasswordresetemail)
  - [setPassword](#setpassword)
  - [saveAddress](#saveaddress)
  - [deleteAddress](#deleteaddress)
  - [getSessionInfo](#getsessioninfo)
- [Examples](#examples)

---

## Installation

Import the `users` module from the SDK:

```typescript
import { craftCommerceHeadlessSdk } from 'path-to-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
```

---

## Methods

### `loginUser`

Log in a user.

#### Example

```typescript
const response = await sdk.users.loginUser({
  loginName: 'user@example.com',
  password: 'securepassword',
});
```

#### Parameters

- **`loginName`**: The user's login name or email.
- **`password`**: The user's password.
- **`rememberMe`**: Optional. Whether to remember the user (0/1).

---

### `saveUser`

Create or update a user profile.

#### Example

```typescript
const response = await sdk.users.saveUser({
  firstName: 'John',
  lastName: 'Doe',
  userId: 11,
});
```

#### Parameters

- **`currentPassword`**: The user’s current password, required if email or newPassword are sent.
- **`email`**: The user’s email address (optional).
- **`fieldsLocation`**: Parameter name under which Craft will look for custom field data (defaults to fields).
- **`fields[...]`**: Custom field values.
- **`fullName`**: The user’s full name. Preferred to discrete firstName and lastName params.
- **`firstName`**: The user’s first name (optional, fullName is preferred).
- **`lastName`**: The user’s last name (optional, fullName is preferred).
- **`newPassword`**: The user’s new password, required when updating the logged-in user’s account. Use password when registering a new user.
- **`passwordResetRequired`**: Whether the user must reset their password before logging in again.
- **`password`**: The user’s password, when registering a new user. Ignored if deferPublicRegistrationPassword is true.
- **`photo`**: An uploaded user photo. Use `<input type="file">`.
- **`sendVerificationEmail`**: Whether a verification email should be sent before accepting the new email (1/0). Only applicable if email verification is enabled.
- **`userId`**: The ID of the user to save, required when updating an existing user.
- **`userVariable`**: The hashed name of the variable that should reference the user in case of validation error (defaults to user).
- **`username`**: The user’s username. Only checked if the useEmailAsUsername config setting is false.

---

### `uploadUserPhoto`

Upload a profile photo for a user.

#### Example

```typescript
const response = await sdk.users.uploadUserPhoto({
  userId: 123,
  photo: fileInput.files[0],
});
```

#### Parameters

- **`userId`**: The ID of the user.
- **`photo`**: A File object containing the photo.

---

### `sendPasswordResetEmail`

Send a password reset email.

#### Example

```typescript
const response = await sdk.users.sendPasswordResetEmail({
  loginName: 'user@example.com',
});
```

#### Parameters

- **`loginName`**: The user's login name or email (optional).
- **`userId`**: The ID of the user to send the password reset email for (optional).

---

### `setPassword`

Set a new password for a user.

#### Example

```typescript
const response = await sdk.users.setPassword({
  code: 'reset-code',
  id: 123,
  newPassword: 'newSecurePassword',
});
```

#### Parameters

- **`code`**: Password reset code.
- **`id`**: The user's ID.
- **`newPassword`**: The new password.

---

## Methods

### `saveAddress`

The `saveAddress` method allows creating or updating a user's address. Use this method to manage billing and shipping addresses or to label addresses for easy identification.

#### Example: Create a New Address

```typescript
const response = await sdk.users.saveAddress({
  fullName: 'Mario Rossi',
  addressLine1: 'Via Mezzaterra, 22',
  postalCode: '32032',
  countryCode: 'IT',
  administrativeArea: 'Veneto',
  locality: 'Feltre',
  title: 'Home', // Optional label for the address
  isPrimaryBilling: true,
  isPrimaryShipping: false,
});

console.log('Address created:', response);
```

#### Example: Update an Existing Address

```typescript
const response = await sdk.users.saveAddress({
  addressId: 123, // ID of the existing address
  fullName: 'Mario Rossi',
  addressLine1: 'Via Mezzaterra, 22',
  postalCode: '32032',
  countryCode: 'IT',
  administrativeArea: 'Veneto',
  locality: 'Feltre',
  title: 'Office', // Updated label for the address
  isPrimaryBilling: true,
  isPrimaryShipping: true,
});

console.log('Address updated:', response);
```

#### Parameters

- **`addressId`**: The ID of the address to update (optional).
- **`userId`**: Owner of the new address (optional).
- **`fullName`**: Name for the address.
- **`firstName`**: First name (optional).
- **`lastName`**: Last name (optional).
- **`countryCode`**: Country code (required).
- **`administrativeArea`**: State or region (required).
- **`locality`**: City or municipality (required).
- **`postalCode`**: Postal code (required).
- **`addressLine1`**: The first line of the address (required).
- **`title`**: Label for the address (e.g., "Home", "Office").
- **`isPrimaryBilling`**: Whether this is the primary billing address (optional).
- **`isPrimaryShipping`**: Whether this is the primary shipping address (optional).

---

### `deleteAddress`

Delete a user's address.

#### Example

```typescript
const response = await sdk.users.deleteAddress({
  addressId: 1,
});
```

#### Parameters

- **`addressId`**: The ID of the address to delete.

---

### `getSessionInfo`

Retrieve the current session information.

#### Example

```typescript
const response = await sdk.users.getSessionInfo();
```

#### Parameters

None.

#### Notes

- To optimize session management and reduce repeated server requests, you can store the session state in a cookie. For instance, save a flag like `isLoggedIn` or `sessionUser` in a client-side cookie or local storage after the first successful check.
- Ensure that sensitive data is not exposed or stored insecurely.

---

## Examples

```typescript
import { craftCommerceHeadlessSdk } from './sdk/';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });

async function main() {
  try {
    // Create a new address
    const newAddressResponse = await sdk.users.saveAddress({
      fullName: 'Mario Rossi',
      addressLine1: 'Via Mezzaterra, 22',
      postalCode: '32032',
      countryCode: 'IT',
      administrativeArea: 'Veneto',
      locality: 'Feltre',
      title: 'Home',
      isPrimaryBilling: true,
      isPrimaryShipping: false,
    });

    console.log('New Address Created:', newAddressResponse);

    // Update an existing address
    const updatedAddressResponse = await sdk.users.saveAddress({
      addressId: 123,
      fullName: 'Mario Rossi',
      addressLine1: 'Via Mezzaterra, 22',
      postalCode: '32032',
      countryCode: 'IT',
      administrativeArea: 'Veneto',
      locality: 'Feltre',
      title: 'Office',
      isPrimaryBilling: true,
      isPrimaryShipping: true,
    });

    console.log('Address Updated:', updatedAddressResponse);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```
