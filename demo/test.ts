// -----------------------------
// Run: npx tsc
// -----------------------------
import {
    craftCommerceHeadlessSdk,
    CraftCommerceHeadlessSdkConfig,
    Client,
    UserLoginData,
    UserSaveData,
    UserPhotoData,
    PasswordResetData,
    SetPasswordData,
    AddressData,
    DeleteAddressData,
    CompleteCartData,
    LoadCartData,
    UpdateCartData,
    AddPaymentSourceData,
    SetPrimaryPaymentSourceData,
    DeletePaymentSourceData,
    PayData,
    CompletePaymentData,
    SubscribeData,
    CancelData,
    SwitchPlanData,
    ReactivateData,
  } from 'craft-commerce-headless-sdk';
  
  const config: CraftCommerceHeadlessSdkConfig = {
    apiBaseUrl: 'https://myapi.com',
    enableLogging: true,
    maxRetries: 2,
  };
  const sdk = craftCommerceHeadlessSdk(config);
    
  const client: Client = sdk.client;

  async function testUsers() {
    const loginData: UserLoginData = { loginName: 'davide@example.com', password: 'password' };
    await sdk.users.loginUser(loginData);
  
    const saveUserData: UserSaveData = {
      email: 'davide@example.com',
      password: 'password',
      userId: 42,
    };
    await sdk.users.saveUser(saveUserData);
  
    const photoData: UserPhotoData = {
      userId: '42',
      photo: new File([], 'avatar.png'),
    };
    await sdk.users.uploadUserPhoto(photoData);
  
    const resetData: PasswordResetData = { loginName: 'davide@example.com' };
    await sdk.users.sendPasswordResetEmail(resetData);
  
    const setPwdData: SetPasswordData = {
      code: 'myresetcode',
      id: '42',
      newPassword: 'newPassword',
    };
    await sdk.users.setPassword(setPwdData);
  
    const addressData: AddressData = {
      addressLine1: 'Via ROma 123',
      countryCode: 'IT',
      postalCode: '32032',
      locality: 'Padova',
      administrativeArea: 'PD',
      isPrimaryShipping: true,
    };
    await sdk.users.saveAddress(addressData);
  
    const deleteAddressData: DeleteAddressData = { addressId: 69 };
    await sdk.users.deleteAddress(deleteAddressData);
  
    await sdk.users.getSessionInfo();
  }
  
  async function testCart() {
    const completeCartData: CompleteCartData = {
      number: '1234432112344321',
      forceSave: true,
    };
    await sdk.cart.completeCart(completeCartData);
  
    await sdk.cart.getCart();
  
    const loadCartData: LoadCartData = { number: '1234432112344321' };
    await sdk.cart.loadCart(loadCartData);
  
    await sdk.cart.forgetCart();
  
    const updateCartData: UpdateCartData = {
      number: '1234432112344321',
      purchasables: [{ id: 5, qty: 2 }],
    };
    await sdk.cart.updateCart(updateCartData);
  }
  
  async function testPaymentSources() {
    const addPS: AddPaymentSourceData = {
      description: 'Visa',
      gatewayId: 3,
      isPrimaryPaymentSource: true,
    };
    await sdk.paymentSources.addPaymentSource(addPS);
  
    const setPrimary: SetPrimaryPaymentSourceData = { id: 7 };
    await sdk.paymentSources.setPrimaryPaymentSource(setPrimary);
  
    const deletePS: DeletePaymentSourceData = { id: 7 };
    await sdk.paymentSources.deletePaymentSource(deletePS);
  }
  
  async function testPayment() {
    const pay: PayData = {
      gatewayId: 3,
      orderEmail: 'davide@example.com',
      number: '1234432112344321',
    };
    await sdk.payment.pay(pay);
  
    const complete: CompletePaymentData = { commerceTransactionHash: 'TOKENHASH' };
    await sdk.payment.completePayment(complete);
  }
  
  async function testSubscriptions() {
    const subscribe: SubscribeData = { planUid: 'plus' };
    await sdk.subscriptions.subscribe(subscribe);
  
    const cancel: CancelData = { subscriptionUid: '123456' };
    await sdk.subscriptions.cancel(cancel);
  
    const switchPlan: SwitchPlanData = {
      subscriptionUid: '123456',
      planUid: 'plus',
    };
    await sdk.subscriptions.switchPlan(switchPlan);
  
    const reactivate: ReactivateData = { subscriptionUid: 'plus' };
    await sdk.subscriptions.reactivate(reactivate);
  }
  
  async function runAll() {
    await testUsers();
    await testCart();
    await testPaymentSources();
    await testPayment();
    await testSubscriptions();
  }
  
  runAll().catch(() => {});
  