# Payment SDK Documentation

The `payment` module provides methods to interact with payment-related actions in Craft CMS Commerce. It supports operations like processing payments and handling off-site payment completions.

For a comprehensive understanding of the underlying functionalities, refer to the [Craft CMS Commerce Controller Actions Documentation](https://craftcms.com/docs/commerce/5.x/reference/controller-actions.html).

### Key Features

- Process payments for orders.
- Complete off-site payments.
- Support for 3D Secure payment flows.

---

## Table of Contents

- [Installation](#installation)
- [Methods](#methods)
  - [pay](#pay)
  - [completePayment](#completepayment)
- [Examples](#examples)

---

## Installation

Import the `payment` module from the SDK:

```typescript
import { craftCommerceHeadlessSdk } from 'path-to-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
```

- **`apiBaseUrl`**: Base URL of your Craft CMS.

---

## Methods

### `pay`

Processes a payment for an order. This method is used for initiating payments, including those requiring 3D Secure verification.

#### Notes

- Ensure the `gatewayId` corresponds to a configured and enabled gateway in Craft CMS Commerce.
- Use `paymentSourceId` to reference a saved payment source.

#### Example

```typescript
const response = await sdk.payment.pay({
  orderEmail: 'user@example.com',
  gatewayId: 3,
  number: 'abc123',
  paymentAmount: 100.0,
  paymentCurrency: 'EUR',
  paymentSourceId: 5,
  registerUserOnOrderComplete: true,
  savePaymentSource: true,
  saveBillingAddressOnOrderComplete: true,
  saveShippingAddressOnOrderComplete: true,
  saveAddressesOnOrderComplete: true,
});
```

#### Parameters

- **`orderEmail`**: The email address associated with the order (optional).
- **`gatewayId`**: The payment gateway ID (required).
- **`number`**: The cart/order number (optional, defaults to the current cart).
- **`paymentAmount`**: The amount to be paid (optional).
- **`paymentCurrency`**: The currency of the payment, represented as ISO 3-letter code (optional).
- **`paymentSourceId`**: The ID of the saved payment source (optional).
- **`registerUserOnOrderComplete`**: Whether to register the user upon order completion (optional).
- **`savePaymentSource`**: Whether to save the payment source for future use (optional).
- **`saveBillingAddressOnOrderComplete`**: Whether to save the billing address upon order completion (optional).
- **`saveShippingAddressOnOrderComplete`**: Whether to save the shipping address upon order completion (optional).
- **`saveAddressesOnOrderComplete`**: Whether to save all addresses upon order completion (optional).
- **`[key: string]: any`**: Additional parameters supported by the gateway form (optional).

---

### `completePayment`

Processes the return of a customer from an off-site payment. This method finalizes the payment in Craft CMS Commerce.

#### Example

```typescript
const response = await sdk.payment.completePayment({
  commerceTransactionHash: '123abc456def',
});
```

#### Parameters

- **`commerceTransactionHash`**: The hash required to verify the payment (required).

---

## Examples

### Example: Payment with 3D Secure

```typescript
import { craftCommerceHeadlessSdk } from './sdk';
import Stripe from 'stripe';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
const stripe = Stripe('your-publishable-key');

async function handlePayment() {
  try {
    // Step 1: Request PaymentIntent from Craft CMS
    const paymentData = await sdk.payment.pay({
      orderEmail: 'user@example.com',
      gatewayId: 3,
    });

    console.log('PaymentIntent generated:', paymentData);

    // Step 2: Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentData.redirectData.client_secret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Mario Rossi',
          },
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful:', paymentIntent);

      // Step 3: Complete payment on Craft CMS
      const completePaymentData = await sdk.payment.completePayment({
        commerceTransactionHash: paymentData.transactionHash,
      });

      console.log('Payment completed on Craft CMS:', completePaymentData);
    }
  } catch (error) {
    console.error('Payment error:', error.message);
  }
}

handlePayment();
```

### Example: Payment without 3D Secure

```typescript
const response = await sdk.payment.pay({
  orderEmail: 'user@example.com',
  gatewayId: 1, // Example gateway ID without 3D Secure
  paymentAmount: 50.0,
  paymentCurrency: 'EUR',
});

console.log('Payment response:', response);
```
