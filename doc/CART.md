# Cart SDK Documentation

The `cart` module provides methods to interact with cart-related actions in Craft Commerce. It supports operations like retrieving, updating, completing carts, and more. All requests are handled securely using the `client` module.

For a comprehensive understanding of the underlying functionalities, refer to the [Craft Commerce Controller Actions Documentation](https://craftcms.com/docs/commerce/5.x/reference/controller-actions.html).

### Key Features

- Retrieve the current cart.
- Add or update items in the cart.
- Manage addresses associated with the cart.
- Complete the cart.
- Forget the cart.

---

## Table of Contents

- [Installation](#installation)
- [Methods](#methods)
  - [completeCart](#completecart)
  - [getCart](#getcart)
  - [loadCart](#loadcart)
  - [forgetCart](#forgetcart)
  - [updateCart](#updatecart)
- [Examples](#examples)

---

## Installation

Import the `cart` module from the SDK:

```typescript
import { craftCommerceHeadlessSdk } from 'craft-commerce-headless-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
```

- **`apiBaseUrl`**: Base URL of your Craft CMS.

---

## Methods

### `completeCart`

Completes the current cart and processes the order without a payment transaction.

#### Notes

- If no `number` parameter is provided, the method acts on the active cart for the current session.
- If a `number` parameter is provided, it attempts to complete the specified cart.
- **Important:** If the "Allow Checkout Without Payment" setting is enabled for the store, customers can complete the cart without a payment. This allows submitting a `POST` request to the `commerce/cart/complete` controller action to finalize the order.

#### Example

```typescript
const response = await sdk.cart.completeCart({
  forceSave: true,
  registerUserOnOrderComplete: true,
});
```

#### Parameters

- **`forceSave`**: Whether to force-save the cart before completing (optional).
- **`number`**: The cart number to complete (optional).
- **`registerUserOnOrderComplete`**: Whether to register the user when the order is completed (optional).

---

### `getCart`

Retrieves the current cart.

#### Notes

- If no `number` parameter is provided, the method retrieves the active cart for the current session.
- If a `number` parameter is provided, it retrieves the specified cart.

#### Example

```typescript
const response = await sdk.cart.getCart({
  number: 'abc123',
});
```

#### Parameters

- **`number`**: The cart number to retrieve (optional).
- **`forceSave`**: Whether to force-save the cart before retrieval (optional).

---

### `loadCart`

Loads a cart by order number.

#### Example

```typescript
const response = await sdk.cart.loadCart({
  number: 'abc123',
});
```

#### Parameters

- **`number`**: The cart number to load (optional).

---

### `forgetCart`

Forgets the current cart.

#### Example

```typescript
const response = await sdk.cart.forgetCart();
```

#### Parameters

None.

---

### `updateCart`

Updates the current cart.

#### Notes

- This method supports a variety of parameters as described in the [Craft CMS documentation](https://craftcms.com/docs/commerce/5.x/reference/controller-actions.html#post-cart-update-cart).
- To add items to the cart, refer to the [Adding Items to Cart guide](https://craftcms.com/docs/commerce/5.x/development/cart.html#adding-items).
- To update a line items to the cart, refer to the [Updating Line items to Cart guide](https://craftcms.com/docs/commerce/5.x/development/cart.html#line-items).
- To add an address to the cart, refer to the [Updating Cart Address guide](https://craftcms.com/docs/commerce/5.x/system/addresses.html#cart-addresses).

#### Examples

**Adding Items to Cart:**

```typescript
const response = await sdk.cart.updateCart({
  purchasables: [
    { id: 123, qty: 2 },
    { id: 456, qty: 1 },
  ],
});
```

**Adding Address to Cart:**

```typescript
const response = await sdk.cart.updateCart({
  shippingAddress: {
    firstName: 'Mario',
    lastName: 'Rossi',
    addressLine1: 'Via Mezzaterra, 22',
    administrativeArea: 'Veneto',
    locality: 'Feltre',
    postalCode: '32032',
    countryCode: 'IT',
  },
});
```

#### Parameters

- **`billingAddress`**: The billing address object (optional).
- **`billingAddressId`**: The ID of the billing address (optional).
- **`billingAddressSameAsShipping`**: Whether the billing address is the same as the shipping address (optional).
- **`clearNotices`**: Whether to clear cart notices (optional).
- **`clearLineItems`**: Whether to clear line items from the cart (optional).
- **`couponCode`**: Coupon code to apply to the cart (optional).
- **`email`**: Email address for the cart (optional).
- **`estimatedBillingAddress`**: The estimated billing address object (optional).
- **`estimatedBillingAddressSameAsShipping`**: Whether the estimated billing address is the same as shipping (optional).
- **`estimatedShippingAddress`**: The estimated shipping address object (optional).
- **`fields`**: Custom field values (optional).
- **`forceSave`**: Whether to force-save the cart (optional).
- **`gatewayId`**: The payment gateway ID (optional).
- **`lineItems`**: Array of line item objects (optional).
- **`number`**: The cart number (optional).
- **`paymentCurrency`**: Payment currency code (optional).
- **`paymentSourceId`**: The payment source ID (optional).
- **`purchasableId`**: The purchasable ID to add to the cart (optional).
- **`purchasables`**: Array of purchasable IDs to add to the cart (optional).
- **`registerUserOnOrderComplete`**: Whether to register the user when the order is completed (optional).
- **`saveBillingAddressOnOrderComplete`**: Whether to save the billing address on order completion (optional).
- **`saveShippingAddressOnOrderComplete`**: Whether to save the shipping address on order completion (optional).
- **`saveAddressesOnOrderComplete`**: Whether to save all addresses on order completion (optional).
- **`shippingAddress`**: The shipping address object (optional).
- **`shippingAddressId`**: The ID of the shipping address (optional).
- **`shippingAddressSameAsBilling`**: Whether the shipping address is the same as the billing address (optional).
- **`shippingMethodHandle`**: The handle of the shipping method (optional).

---

## Examples

```typescript
import { craftCommerceHeadlessSdk } from './sdk/';

const sdk = craftCommerceHeadlessSdk({
  apiBaseUrl: 'https://craft-commerce-headless.ddev.site/',
});

async function main() {
  try {
    // Get the active cart
    const cartResponse = await sdk.cart.getCart();
    console.log('Current cart:', cartResponse);

    // Update the cart with new items
    const updateResponse = await sdk.cart.updateCart({
      purchasables: [{ id: 123, qty: 2 }],
    });
    console.log('Cart updated:', updateResponse);

    // Complete the active cart
    const completeResponse = await sdk.cart.completeCart({
      forceSave: true,
      registerUserOnOrderComplete: true,
    });
    console.log('Cart completed:', completeResponse);

    // Retrieve a specific cart by number
    const specificCartResponse = await sdk.cart.getCart({
      number: 'abc123',
    });
    console.log('Specific cart:', specificCartResponse);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```
