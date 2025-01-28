# Craft Commerce Headless SDK Documentation Index

Welcome to the SDK documentation! This SDK is designed to simplify integration with **Craft CMS Commerce**, offering specialized modules for users, carts, payments, subscriptions, and more. Whether you're building a headless e-commerce application or enhancing an existing Craft CMS Commerce setup, this guide will help you navigate and implement the SDK effectively.

> **Note:** Craft Commerce version 4 or higher is required for compatibility with this SDK.

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
   This will start the demo locally.

---

## Getting Started

Before using the SDK, ensure that Craft CMS and Craft CMS Commerce are correctly configured for headless usage. Follow the [Craft CMS Configuration Guide](./doc/CONFIGURATION.md) for essential setup steps, including CORS configuration and cookie settings.

Once Craft CMS Commerce is ready, you can use the modules below to handle specific e-commerce actions, each designed to interact seamlessly with Craft CMS Commerce features.

---

## Craft CMS Configuration Guide

This section provides details on configuring Craft CMS for headless usage, including CORS setup and other necessary settings.

- [Configuration](./CONFIGURATION.md)

---

## Client Module

The base module for API communication, handling HTTP requests with `post` and `get` methods.

- [Installation](./doc/CLIENT.md#installation)
- [Methods](./doc/CLIENT.md#methods)
  - [post](./doc/CLIENT.md#post)
  - [get](./doc/CLIENT.md#get)
- [Examples](./doc/CLIENT.md#examples)

---

## Users Module

This module handles user account creation, profile management, and address handling. It simplifies operations like login, password resets, and managing user-related data, all essential for e-commerce platforms.

- [Installation](./doc/USERS.md#installation)
- [Methods](./doc/USERS.md#methods)
  - [loginUser](./doc/USERS.md#loginuser)
  - [saveUser](./doc/USERS.md#saveuser)
  - [uploadUserPhoto](./doc/USERS.md#uploaduserphoto)
  - [sendPasswordResetEmail](./doc/USERS.md#sendpasswordresetemail)
  - [setPassword](./doc/USERS.md#setpassword)
  - [saveAddress](./doc/USERS.md#saveaddress)
  - [deleteAddress](./doc/USERS.md#deleteaddress)
  - [getSessionInfo](./doc/USERS.md#getsessioninfo)
- [Examples](./doc/USERS.md#examples)

---

## Cart Module

Manage shopping cart actions, including retrieval, updates, and checkout operations. This module supports typical e-commerce workflows in Craft CMS Commerce.

- [Installation](./doc/CART.md#installation)
- [Methods](./doc/CART.md#methods)
  - [completeCart](./doc/CART.md#completecart)
  - [getCart](./doc/CART.md#getcart)
  - [loadCart](./doc/CART.md#loadcart)
  - [forgetCart](./doc/CART.md#forgetcart)
  - [updateCart](./doc/CART.md#updatecart)
- [Examples](./doc/CART.md#examples)

---

## Payment Sources Module

Create, manage, and assign payment methods to user accounts. This module supports common payment operations like adding or removing payment sources, tailored for Craft CMS Commerce.

- [Installation](./doc/PAYMENT_SOURCES.md#installation)
- [Methods](./doc/PAYMENT_SOURCES.md#methods)
  - [addPaymentSource](./doc/PAYMENT_SOURCES.md#addpaymentsource)
  - [setPrimaryPaymentSource](./doc/PAYMENT_SOURCES.md#setprimarypaymentsource)
  - [deletePaymentSource](./doc/PAYMENT_SOURCES.md#deletepaymentsource)
- [Examples](./doc/PAYMENT_SOURCES.md#examples)

---

## Payment Module

Handle payments, including support for 3D Secure and other gateway integrations. This module streamlines the process of initiating and completing payments in Craft CMS Commerce.

- [Installation](./doc/PAYMENT.md#installation)
- [Methods](./doc/PAYMENT.md#methods)
  - [pay](./doc/PAYMENT.md#pay)
  - [completePayment](./doc/PAYMENT.md#completepayment)
- [Examples](./doc/PAYMENT.md#examples)

---

## Subscriptions Module

Manage subscriptions, including plan creation, cancellations, switching, and reactivation. This module simplifies recurring payment setups in Craft CMS Commerce.

- [Installation](./doc/SUBSCRIPTIONS.md#installation)
- [Methods](./doc/SUBSCRIPTIONS.md#methods)
  - [subscribe](./doc/SUBSCRIPTIONS.md#subscribe)
  - [cancel](./doc/SUBSCRIPTIONS.md#cancel)
  - [switchPlan](./doc/SUBSCRIPTIONS.md#switchplan)
  - [reactivate](./doc/SUBSCRIPTIONS.md#reactivate)
- [Examples](./doc/SUBSCRIPTIONS.md#examples)

