import { loadStripe } from '@stripe/stripe-js';
import { craftCommerceHeadlessSdk } from '../dist/craft-commerce-headless-sdk.es.js';

let sdk;
let stripe;
let elements;
let apiBaseUrl = '';
let graphqlEndpoint = '';
let stripeGatewayId = '';

function activateSection(sectionId) {
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.remove('active', 'inactive');
    section.classList.add('inactive');
  });
  const section = document.getElementById(sectionId);
  section.classList.remove('inactive');
  section.classList.add('active');
}

// Show toast messages
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');

  // Create the toast element
  const toast = document.createElement('div');
  toast.className = `flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  toast.innerHTML = `
    <span class="font-medium mr-2">${
      type === 'success' ? 'Success!' : 'Error:'
    }</span> ${message}
  `;

  // Add the toast to the container
  toastContainer.appendChild(toast);

  // Automatically remove the toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Load stored configurations on page load
document.addEventListener('DOMContentLoaded', () => {
  const storedApiBaseUrl = localStorage.getItem('apiBaseUrl');
  const storedGraphqlEndpoint = localStorage.getItem('graphqlEndpoint');
  const storedStripeGatewayId = localStorage.getItem('stripeGatewayId');
  const storedStripePublishableKey = localStorage.getItem(
    'stripePublishableKey'
  );

  if (storedApiBaseUrl)
    document.getElementById('apiBaseUrl').value = storedApiBaseUrl;
  if (storedGraphqlEndpoint)
    document.getElementById('graphqlEndpoint').value = storedGraphqlEndpoint;
  if (storedStripeGatewayId)
    document.getElementById('stripeGatewayId').value = storedStripeGatewayId;
  if (storedStripePublishableKey)
    document.getElementById('stripePublishableKey').value =
      storedStripePublishableKey;
});

async function fetchProducts() {
  const query = `query MyQuery {
    products {
      id
      slug
      title
      variants {
        salePriceAsCurrency
        id
        title
      }
    }
  }`;

  try {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    showToast('Failed to fetch products.', 'error');
  }
}

function renderProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className = 'border p-4 rounded-lg shadow-md';

    const title = document.createElement('h3');
    title.className = 'font-bold text-lg mb-2';
    title.textContent = product.title;

    const variantSelect = document.createElement('select');
    variantSelect.className = 'border rounded px-3 py-2 w-full mb-2';
    product.variants.forEach((variant) => {
      const option = document.createElement('option');
      option.value = variant.id;
      option.textContent = `${variant.title} - ${variant.salePriceAsCurrency}`;
      variantSelect.appendChild(option);
    });

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.className = 'border rounded px-3 py-2 w-full mb-2';

    productCard.appendChild(title);
    productCard.appendChild(variantSelect);
    productCard.appendChild(quantityInput);
    productList.appendChild(productCard);
  });
}

function renderCart(cart) {
  const cartSummary = document.getElementById('cart-summary');
  const cartShipping = document.getElementById('cart-shipping');
  const cartTaxes = document.getElementById('cart-taxes');

  if (cart && cart.lineItems.length > 0) {
    console.log(cart);
    // Line items
    cartSummary.innerHTML = `
      <ul>
        ${cart.lineItems
          .map(
            (item) => `
              <li class="mb-2 flex justify-between">
                <span>${item.description}</span>
                <span>${item.qty} x ${item.salePriceAsCurrency}</span>
              </li>
            `
          )
          .join('')}
      </ul>
      <div class="mt-4 border-t pt-4">
        <div class="flex justify-between">
          <span>Subtotal:</span>
          <span class="font-bold">${cart.totalAsCurrency}</span>
        </div>
      </div>
    `;

    // Shipping cost
    cartShipping.innerHTML = `
      <div class="flex justify-between mt-2">
        <span>Shipping:</span>
        <span>${cart.totalShippingCostAsCurrency || '$0.00'}</span>
      </div>
    `;

    // Taxes
    cartTaxes.innerHTML = `
      <div class="flex justify-between mt-2">
        <span>Taxes:</span>
        <span>${cart.totalTaxAsCurrency || '$0.00'}</span>
      </div>
    `;
  } else {
    cartSummary.innerHTML = `
      <p class="text-sm text-gray-500">Your cart is empty.</p>
    `;
    cartShipping.innerHTML = '';
    cartTaxes.innerHTML = '';
  }
}

async function updateCartDisplay() {
  try {
    const { cart } = await sdk.cart.getCart();
    renderCart(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    showToast('Failed to update cart display.', 'error');
  }
}

document.getElementById('set-config').addEventListener('click', () => {
  apiBaseUrl = document.getElementById('apiBaseUrl').value;
  graphqlEndpoint = document.getElementById('graphqlEndpoint').value;
  stripeGatewayId = document.getElementById('stripeGatewayId').value;
  const stripePublishableKey = document.getElementById(
    'stripePublishableKey'
  ).value;

  if (
    !apiBaseUrl ||
    !graphqlEndpoint ||
    !stripeGatewayId ||
    !stripePublishableKey
  ) {
    showToast(
      'Please provide API Base URL, GraphQL Endpoint, Stripe Gateway ID, and Stripe Publishable Key',
      'error'
    );
    return;
  }

  // Save configurations to localStorage
  localStorage.setItem('apiBaseUrl', apiBaseUrl);
  localStorage.setItem('graphqlEndpoint', graphqlEndpoint);
  localStorage.setItem('stripeGatewayId', stripeGatewayId);
  localStorage.setItem('stripePublishableKey', stripePublishableKey);

  // Initialize SDK and Stripe
  sdk = craftCommerceHeadlessSdk({ apiBaseUrl });
  loadStripe(stripePublishableKey).then((stripeInstance) => {
    stripe = stripeInstance;
    elements = stripe.elements();
  });

  activateSection('login-section');
  showToast('Configuration saved successfully!', 'success');
});

document.getElementById('login-button').addEventListener('click', async () => {
  const loginName = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await sdk.users.loginUser({ loginName, password });
    if (response.errorCode) {
      throw new Error(response.message || 'Login failed');
    }

    const products = await fetchProducts();
    if (products) {
      renderProducts(products);
      activateSection('product-section');
    }

    await updateCartDisplay();
    showToast('Login successful!', 'success');
  } catch (error) {
    showToast('An error occurred during login: ' + error.message, 'error');
    return;
  }
});

document
  .getElementById('add-to-cart-button')
  .addEventListener('click', async () => {
    const productList = document.querySelectorAll('#product-list > div');
    const purchasables = [];

    productList.forEach((productCard) => {
      const variantSelect = productCard.querySelector('select');
      const quantityInput = productCard.querySelector('input[type="number"]');

      const variantId = variantSelect.value;
      const quantity = parseInt(quantityInput.value);

      if (variantId) {
        purchasables.push({
          id: parseInt(variantId),
          qty: quantity,
        });
      }
    });

    if (purchasables.length === 0) {
      showToast(
        'Please select at least one product with a valid quantity.',
        'error'
      );
      return;
    }

    try {
      const response = await sdk.cart.updateCart({ purchasables });

      if (response.errors) {
        throw new Error('Failed to add items to cart.');
      }
      showToast('Products added to cart successfully!', 'success');
      await updateCartDisplay();
      activateSection('address-section');
    } catch (error) {
      showToast(
        'An error occurred while updating the cart: ' + error.message,
        'error'
      );
      return;
    }
  });

document
  .getElementById('save-address-button')
  .addEventListener('click', async () => {
    const addressData = {
      fullName: document.getElementById('fullName').value,
      addressLine1: document.getElementById('addressLine1').value,
      postalCode: document.getElementById('postalCode').value,
      countryCode: document.getElementById('countryCode').value,
      locality: document.getElementById('locality').value,
      administrativeArea: document.getElementById('administrativeArea').value,
      title: document.getElementById('title').value,
      isPrimaryShipping: true,
    };

    try {
      const response = await sdk.users.saveAddress(addressData);
      if (response.errors) {
        const errors = Object.entries(response.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join(' | ');
        throw new Error(errors);
      }
      const addressId = response.modelId;

      const cartResponse = await sdk.cart.updateCart({
        shippingAddressId: addressId,
        billingAddressSameAsShipping: true,
      });

      if (cartResponse.errors) {
        throw new Error('Failed to add address to cart.');
      }

      showToast('Address added to cart successfully!', 'success');

      const shippingMethods = cartResponse.cart.availableShippingMethodOptions;
      const shippingMethodsList = document.getElementById(
        'shipping-methods-list'
      );
      shippingMethodsList.innerHTML = '';

      Object.values(shippingMethods).forEach((method) => {
        const label = document.createElement('label');
        label.className = 'block mb-2';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'shippingMethodHandle';
        input.value = method.shippingMethod.handle;
        input.className = 'mr-2';

        label.appendChild(input);
        label.appendChild(
          document.createTextNode(`${method.name} (${method.priceAsCurrency})`)
        );

        shippingMethodsList.appendChild(label);
      });

      activateSection('shipping-methods-section');
    } catch (error) {
      showToast(
        'An error occurred while saving the address: ' + error.message,
        'error'
      );
    }
  });

document
  .getElementById('select-shipping-method-button')
  .addEventListener('click', async () => {
    const shippingMethodsList = document.getElementById(
      'shipping-methods-list'
    );
    const selectedMethod = document.querySelector(
      'input[name="shippingMethodHandle"]:checked'
    );

    if (shippingMethodsList.children.length === 0) {
      activateSection('payment-section');
      const cardElement = elements.create('card');
      cardElement.mount('#stripe-elements');
      return;
    }

    if (selectedMethod) {
      try {
        const response = await sdk.cart.updateCart({
          shippingMethodHandle: selectedMethod.value,
        });

        if (response.errors) {
          throw new Error('Failed to add shipping method.');
        }

        showToast('Shipping method added to cart successfully!', 'success');
        activateSection('payment-section');
        await updateCartDisplay();

        const cardElement = elements.create('card');
        cardElement.mount('#stripe-elements');
      } catch (error) {
        showToast(
          'An error occurred while updating the cart: ' + error.message,
          'error'
        );
      }
    } else {
      showToast('Please select a shipping method.', 'error');
    }
  });

document.getElementById('pay-button').addEventListener('click', async () => {
  try {
    const cart = await sdk.cart.getCart();
    console.log(cart);

    const paymentResponse = await sdk.payment.pay({
      orderEmail: document.getElementById('loginEmail').value,
      gatewayId: stripeGatewayId,
    });

    if (paymentResponse.message) {
      throw new Error(paymentResponse.message || 'Payment initiation failed');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentResponse.redirectData.client_secret,
      {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: { name: document.getElementById('fullName').value },
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      const completePaymentResponse = await sdk.payment.completePayment({
        commerceTransactionHash: paymentResponse.transactionHash,
      });

      showToast('Payment successful!', 'success');
      activateSection('complete-section');

      console.log('Payment completed:', completePaymentResponse);
    }
  } catch (error) {
    console.log('catch', error);
    showToast('An error occurred during payment: ' + error.message, 'error');
    return;
  }
});
