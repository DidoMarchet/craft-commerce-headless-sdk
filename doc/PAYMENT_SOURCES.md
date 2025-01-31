# Payment Sources SDK Documentation

The `paymentSources` module provides methods to interact with payment source-related actions in Craft Commerce. It supports operations like adding, updating, setting as primary, and deleting payment sources. All requests are handled securely using the `Client` module.

For a comprehensive understanding of the underlying functionalities, refer to the [Craft Commerce Controller Actions Documentation](https://craftcms.com/docs/commerce/5.x/reference/controller-actions.html).

### Key Features

- Add a new payment source.
- Set a primary payment source.
- Delete an existing payment source.

---

## Table of Contents

- [Installation](#installation)
- [Methods](#methods)
  - [addPaymentSource](#addpaymentsource)
  - [setPrimaryPaymentSource](#setprimarypaymentsource)
  - [deletePaymentSource](#deletepaymentsource)
- [Examples](#examples)

---

## Installation

Import the `paymentSources` module from the SDK:

```typescript
import { craftCommerceHeadlessSdk } from 'craft-commerce-headless-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
```

- **`apiBaseUrl`**: Base URL of your Craft CMS.

---

## Methods

### `addPaymentSource`

Adds a new payment source.

#### Notes

- The structure of `paymentForm` depends on the gateway configured in Craft CMS.
- Ensure that the gateway supports the payment method being added.

#### Example

```typescript
const response = await sdk.paymentSources.addPaymentSource({
  description: 'My Personal Visa Card',
  gatewayId: 1,
  isPrimaryPaymentSource: true,
  paymentForm: {
    cardNumber: '4242424242424242',
    expiryMonth: '12',
    expiryYear: '2030',
    cvv: '123',
  },
});
```

#### Parameters

- **`description`**: A description for the payment source (optional).
- **`gatewayId`**: The gateway ID for the payment source (required).
- **`isPrimaryPaymentSource`**: Whether this payment source should be set as primary (optional).
- **`paymentForm`**: An object containing the payment details required by the gateway (required).
- **`[key: string]: any`**: Additional parameters supported by the gateway form (optional).

---

### `setPrimaryPaymentSource`

Sets an existing payment source as primary.

#### Example

```typescript
const response = await sdk.paymentSources.setPrimaryPaymentSource({
  id: 123,
});
```

#### Parameters

- **`id`**: The ID of the payment source to set as primary (required).

---

### `deletePaymentSource`

Deletes an existing payment source.

#### Example

```typescript
const response = await sdk.paymentSources.deletePaymentSource({
  id: 123,
});
```

#### Parameters

- **`id`**: The ID of the payment source to delete (required).

---

## Examples

```typescript
import { craftCommerceHeadlessSdk } from './sdk/';

const sdk = craftCommerceHeadlessSdk({
  apiBaseUrl: 'https://craft-commerce-headless.ddev.site/',
});

async function main() {
  try {
    // Add a new payment source
    const addResponse = await sdk.paymentSources.addPaymentSource({
      description: 'Personal Visa Card',
      gatewayId: 1,
      isPrimaryPaymentSource: true,
      paymentForm: {
        cardNumber: '4242424242424242',
        expiryMonth: '12',
        expiryYear: '2030',
        cvv: '123',
      },
    });
    console.log('Payment Source Added:', addResponse);

    // Set an existing payment source as primary
    const setPrimaryResponse = await sdk.paymentSources.setPrimaryPaymentSource(
      {
        id: addResponse.id, // Use the ID returned from adding the payment source
      }
    );
    console.log('Primary Payment Source Set:', setPrimaryResponse);

    // Delete a payment source
    const deleteResponse = await sdk.paymentSources.deletePaymentSource({
      id: addResponse.id, // Use the ID returned from adding the payment source
    });
    console.log('Payment Source Deleted:', deleteResponse);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```

---

### Notes on Gateway Configuration

- Ensure the gateway supports the payment methods you wish to use.
- Check the Craft Commerce settings to verify gateway configurations.
- For additional details, refer to the [Craft Commerce Gateway Documentation](https://craftcms.com/docs/commerce/5.x/payment-gateways.html).
