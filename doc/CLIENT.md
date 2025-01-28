# Client SDK Documentation

The `client` module allows you to make `GET` and `POST` requests to custom endpoints in Craft CMS Commerce. It automatically handles sessions with cookies and provides flexibility in configuring headers and handling responses.

### Key Features

- Automatic CSRF token and session management.
- Flexible configuration for request headers.
- Simplified handling of different response types.

---

## Table of Contents

- [Installation](#installation)
- [Methods](#methods)
  - [post](#post)
  - [get](#get)
- [Examples](#examples)

---

## Installation

Import the `craftCommerceHeadlessSdk` function:

```typescript
import { craftCommerceHeadlessSdk } from 'craft-commerce-headless-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });
```

- **`apiBaseUrl`**: The base URL of your Craft CMS installation.

---

## Methods

### `post`

Make a `POST` request to a custom API endpoint.

#### Example

```typescript
const response = await sdk.client.post(
  'custom/endpoint',
  {
    key: 'value',
  },
  {
    contentType: 'application/json', // Default
    accept: 'application/json', // Default
    headers: {
      Authorization: 'Bearer your-token',
      'Custom-Header': 'HeaderValue',
    },
  }
);
```

#### Parameters

- **`endpoint`**: The API endpoint relative to the base URL.
- **`payload`**: The request body (optional).
- **`options`**:
  - **`accept`**: The expected response type (default: `application/json`).
  - **`contentType`**: The type of the request payload (default: `application/json`).
  - **`headers`**: Additional headers provided as key-value pairs (e.g., `{ Authorization: 'Bearer token', 'Custom-Header': 'value' }`).

---

### `get`

Make a `GET` request to a custom API endpoint.

#### Example

```typescript
const response = await sdk.client.get(
  'custom/endpoint',
  {
    param: 'value',
  },
  {
    accept: 'application/json', // Default
    headers: {
      Authorization: 'Bearer your-token',
      'Custom-Header': 'HeaderValue',
    },
  }
);
```

#### Parameters

- **`endpoint`**: The API endpoint relative to the base URL.
- **`params`**: Query parameters (optional).
- **`options`**:
  - **`accept`**: The expected response type (default: `application/json`).
  - **`headers`**: Additional headers provided as key-value pairs (e.g., `{ Authorization: 'Bearer token', 'Custom-Header': 'value' }`).

---

## Examples

```typescript
import { craftCommerceHeadlessSdk } from 'craft-commerce-headless-sdk';

const sdk = craftCommerceHeadlessSdk({ apiBaseUrl: 'https://example.com/' });

async function fetchData() {
  try {
    const response = await sdk.client.get(
      'custom/endpoint',
      {
        param: 'value',
      },
      {
        accept: 'application/json',
        headers: {
          Authorization: 'Bearer your-token',
          'Custom-Header': 'HeaderValue',
        },
      }
    );
    console.log('Data:', response);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

async function sendData() {
  try {
    const response = await sdk.client.post(
      'custom/endpoint',
      {
        key: 'value',
      },
      {
        accept: 'application/json',
        headers: {
          Authorization: 'Bearer your-token',
          'Custom-Header': 'HeaderValue',
        },
      }
    );
    console.log('Response:', response);
  } catch (error) {
    console.error('Failed to send data:', error);
  }
}

fetchData();
sendData();
```
