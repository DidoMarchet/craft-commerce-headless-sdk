# Subscriptions SDK Documentation

The `subscriptions` module provides methods to interact with subscription-related actions in Craft CMS Commerce. It supports operations like starting, canceling, switching, and reactivating subscriptions.

For a comprehensive understanding of the underlying functionalities, refer to the [Craft CMS Commerce Controller Actions Documentation](https://craftcms.com/docs/commerce/5.x/reference/controller-actions.html).

---

### Key Features

- Start a new subscription.
- Cancel an active subscription.
- Switch plans for an active subscription.
- Reactivate a canceled subscription.

---

### Table of Contents

- [Installation](#installation)
- [Methods](#methods)
  - [subscribe](#subscribe)
  - [cancel](#cancel)
  - [switchPlan](#switchplan)
  - [reactivate](#reactivate)
- [Examples](#examples)
- [Generating HMAC Hashes](#generating-hmac-hashes)

---

### Installation

Import the `subscriptions` module from the SDK:

```typescript
import { craftCommerceHeadlessSdk } from 'path-to-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
```

- **`apiBaseUrl`**: The base URL of your Craft CMS installation, ending with `/`.

---

### Methods

#### `subscribe`

Starts a new subscription.

##### Example

```typescript
const response = await sdk.subscriptions.subscribe({
  planUid: 'hashed-plan-uid',
  fields: {
    customField1: 'Value 1',
    customField2: 'Value 2',
  },
  fieldsLocation: 'customFields',
});

console.log('Subscription started:', response);
```

##### Parameters

- **`planUid`**: The UID of the subscription plan (required).
- **`fields`**: Custom fields for the subscription (optional).
- **`fieldsLocation`**: The parameter name for custom fields (optional, defaults to `fields`).
- **`[key: string]: any`**: Additional parameters specific to the gateway (optional).

---

#### `cancel`

Cancels an active subscription.

##### Example

```typescript
const response = await sdk.subscriptions.cancel({
  subscriptionUid: 'hashed-subscription-uid',
});

console.log('Subscription canceled:', response);
```

##### Parameters

- **`subscriptionUid`**: The UID of the subscription to cancel (required).
- **`[key: string]: any`**: Additional parameters specific to the gateway (optional).

---

#### `switchPlan`

Switches the plan of an active subscription.

##### Example

```typescript
const response = await sdk.subscriptions.switchPlan({
  subscriptionUid: 'hashed-subscription-uid',
  planUid: 'hashed-new-plan-uid',
});

console.log('Subscription plan switched:', response);
```

##### Parameters

- **`subscriptionUid`**: The UID of the subscription to modify (required).
- **`planUid`**: The UID of the new plan (required).
- **`[key: string]: any`**: Additional parameters specific to the gateway (optional).

---

#### `reactivate`

Reactivates a canceled subscription.

##### Example

```typescript
const response = await sdk.subscriptions.reactivate({
  subscriptionUid: 'hashed-subscription-uid',
});

console.log('Subscription reactivated:', response);
```

##### Parameters

- **`subscriptionUid`**: The UID of the subscription to reactivate (required).

---

### Examples

```typescript
import { craftCommerceHeadlessSdk } from './sdk';
import CryptoJS from 'crypto-js';

const generateHMAC = (key, message, algorithm = 'SHA256') => {
  if (algorithm !== 'SHA256') {
    throw new Error('Only SHA256 is supported in this example');
  }
  const hmac = CryptoJS.HmacSHA256(message, key);
  return hmac.toString(CryptoJS.enc.Hex);
};

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });

async function main() {
  try {
    // Generate HMAC hash for the subscription
    const secretKey = 'your-craft-security-key';
    const subscriptionUid = 'subscription-uid';
    const hashedSubscriptionUid = generateHMAC(secretKey, subscriptionUid);
    const finalSubscriptionUid = hashedSubscriptionUid + subscriptionUid;

    // Start a new subscription
    const subscribeResponse = await sdk.subscriptions.subscribe({
      planUid: finalSubscriptionUid,
      fields: {
        notes: 'This is a test subscription',
      },
    });
    console.log('Subscription started:', subscribeResponse);

    // Cancel an existing subscription
    const cancelResponse = await sdk.subscriptions.cancel({
      subscriptionUid: finalSubscriptionUid,
    });
    console.log('Subscription canceled:', cancelResponse);

    // Switch subscription plan
    const switchPlanResponse = await sdk.subscriptions.switchPlan({
      subscriptionUid: finalSubscriptionUid,
      planUid: 'hashed-new-plan-uid',
    });
    console.log('Subscription plan switched:', switchPlanResponse);

    // Reactivate a canceled subscription
    const reactivateResponse = await sdk.subscriptions.reactivate({
      subscriptionUid: finalSubscriptionUid,
    });
    console.log('Subscription reactivated:', reactivateResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

---

### Generating HMAC Hashes

Some subscription-related actions require UIDs to be hashed with an HMAC algorithm and the resulting hash to be prefixed to the original UID. This process should be securely handled server-side to ensure the security of your Craft CMS installation.

```typescript
import CryptoJS from 'crypto-js';

const generateHMAC = (key, message, algorithm = 'SHA256') => {
  if (algorithm !== 'SHA256') {
    throw new Error('Only SHA256 is supported in this example');
  }
  const hmac = CryptoJS.HmacSHA256(message, key);
  return hmac.toString(CryptoJS.enc.Hex);
};

// Example usage
const secretKey = 'your-craft-security-key'; // The security key configured in Craft CMS
const uid = 'subscription-uid';
const hashedUid = generateHMAC(secretKey, uid);
const finalUid = hashedUid + uid; // Combine the hash with the original UID
console.log('Final UID:', finalUid);
```

#### Important Notes

- The `secretKey` corresponds to the Security Key configured in your Craft CMS installation.
- **Always handle HMAC generation server-side** to prevent exposing sensitive keys in your client-side code.
- The generated hash must be prefixed to the original UID for all subscription-related actions.
