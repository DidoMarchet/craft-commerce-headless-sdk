# Craft Commerce Headless SDK Documentation Index

This SDK is designed to simplify integration with **Craft Commerce**, offering specialized modules for users, carts, payments, subscriptions, and more. Whether you're building a headless e-commerce application or enhancing an existing Craft Commerce setup, this guide will help you navigate and implement the SDK effectively.

> **Note:** Craft Commerce version 4 or higher is required for compatibility with this SDK.

---

## Table of Contents

1. [Demo and Local Testing](#demo-and-local-testing)
2. [Craft CMS Configuration Guide](#craft-cms-configuration-guide)
3. [Package Installation](#package-installation)
4. [Client Module](#client-module)
5. [Users Module](#users-module)
6. [Cart Module](#cart-module)
7. [Payment Sources Module](#payment-sources-module)
8. [Payment Module](#payment-module)
9. [Subscriptions Module](#subscriptions-module)
10. [Suggestions for Craft CMS Improvements](#suggestions-for-craft-cms-improvements)

---

## Demo and Local Testing

You can see a working demo of the SDK at this link:  
[https://craft-commerce-headless-sdk.netlify.app/](https://craft-commerce-headless-sdk.netlify.app/)

If you want to test the SDK locally, follow these steps:
1. Clone the repository.
2. Navigate to the `demo` folder.
3. Run the following commands:
   ```bash
   npm install
   npm run dev
   ```
   This will start the demo locally. Before using the SDK, ensure that Craft CMS and Craft Commerce are correctly configured for headless usage. Follow the [Craft CMS Configuration Guide](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CONFIGURATION.md) for essential setup steps, including CORS configuration and cookie settings.

---

## Craft CMS Configuration Guide

This section provides details on configuring Craft CMS for headless usage, including CORS setup and other necessary settings.

- [Configuration](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CONFIGURATION.md)

---

## Package Installation

To use the Craft Commerce Headless SDK in your project, you can install it using your preferred package manager. Here are the commands for different managers:

### npm
```bash
npm install craft-commerce-headless-sdk
```

### pnpm
```bash
pnpm add craft-commerce-headless-sdk
```

### yarn
```bash
yarn add craft-commerce-headless-sdk
```

After installation, you can import the SDK in your code:

```javascript
import { craftCommerceHeadlessSdk } from 'craft-commerce-headless-sdk';
```

---

## Client Module

The base module for API communication, handling HTTP requests with `post` and `get` methods.

- [Installation](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CLIENT.md#installation)
- [Methods](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CLIENT.md#methods)
  - [post](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CLIENT.md#post)
  - [get](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CLIENT.md#get)
- [Examples](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CLIENT.md#examples)

---

## Users Module

This module handles user account creation, profile management, and address handling. It simplifies operations like login, password resets, and managing user-related data, all essential for e-commerce platforms.

- [Installation](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#installation)
- [Methods](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#methods)
  - [loginUser](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#loginuser)
  - [saveUser](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#saveuser)
  - [uploadUserPhoto](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#uploaduserphoto)
  - [sendPasswordResetEmail](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#sendpasswordresetemail)
  - [setPassword](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#setpassword)
  - [saveAddress](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#saveaddress)
  - [deleteAddress](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#deleteaddress)
  - [getSessionInfo](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#getsessioninfo)
- [Examples](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/USERS.md#examples)

---

## Cart Module

Manage shopping cart actions, including retrieval, updates, and checkout operations. This module supports typical e-commerce workflows in Craft Commerce.

- [Installation](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#installation)
- [Methods](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#methods)
  - [completeCart](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#completecart)
  - [getCart](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#getcart)
  - [loadCart](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#loadcart)
  - [forgetCart](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#forgetcart)
  - [updateCart](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#updatecart)
- [Examples](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/CART.md#examples)

---

## Payment Sources Module

Create, manage, and assign payment methods to user accounts. This module supports common payment operations like adding or removing payment sources, tailored for Craft Commerce.

- [Installation](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT_SOURCES.md#installation)
- [Methods](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT_SOURCES.md#methods)
  - [addPaymentSource](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT_SOURCES.md#addpaymentsource)
  - [setPrimaryPaymentSource](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT_SOURCES.md#setprimarypaymentsource)
  - [deletePaymentSource](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT_SOURCES.md#deletepaymentsource)
- [Examples](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT_SOURCES.md#examples)

---

## Payment Module

Handle payments, including support for 3D Secure and other gateway integrations. This module streamlines the process of initiating and completing payments in Craft Commerce.

- [Installation](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT.md#installation)
- [Methods](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT.md#methods)
  - [pay](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT.md#pay)
  - [completePayment](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT.md#completepayment)
- [Examples](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/PAYMENT.md#examples)

---

## Subscriptions Module

Manage subscriptions, including plan creation, cancellations, switching, and reactivation. This module simplifies recurring payment setups in Craft Commerce.

- [Installation](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#installation)
- [Methods](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#methods)
  - [subscribe](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#subscribe)
  - [cancel](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#cancel)
  - [switchPlan](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#switchplan)
  - [reactivate](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#reactivate)
- [Examples](https://github.com/DidoMarchet/craft-commerce-headless-sdk/blob/main/doc/SUBSCRIPTIONS.md#examples)

---

## Suggestions for Craft CMS Improvements

While this SDK provides extensive functionality, there are a few additional features that would greatly enhance the integration experience if included directly in Craft CMS or Craft Commerce:

- **Include Available Payment Gateways in the Cart**: Similar to how shipping methods are returned, having payment gateways listed directly in the cart data would streamline the checkout process and improve integration ease.

- **Return User-Associated Addresses**: Adding a feature to retrieve addresses associated with a user, similar to the `actions/users/session-info` method for session data, would simplify managing user information in headless implementations.

