/**
 * Initializes the Craft CMS Headless client with the provided API base URL.
 * @param apiBaseUrl - The base URL of the Craft CMS API.
 * @returns An object exposing the initialized client and associated functionalities.
 */
export declare const craftCommerceHeadlessSdk: ({ apiBaseUrl, }: {
    apiBaseUrl: string;
}) => {
    client: import("./api/client").Client;
    users: {
        loginUser: (userData: import("./api/users").UserLoginData) => Promise<any>;
        saveUser: (userData: import("./api/users").UserSaveData) => Promise<any>;
        uploadUserPhoto: (userData: import("./api/users").UserPhotoData) => Promise<any>;
        sendPasswordResetEmail: (userData: import("./api/users").PasswordResetData) => Promise<any>;
        setPassword: (userData: import("./api/users").SetPasswordData) => Promise<any>;
        saveAddress: (addressData: import("./api/users").AddressData) => Promise<any>;
        deleteAddress: (addressData: import("./api/users").DeleteAddressData) => Promise<any>;
        getSessionInfo: () => Promise<any>;
    };
    cart: {
        completeCart: (cartData: import("./api/cart").CompleteCartData) => Promise<any>;
        getCart: (cartData: import("./api/cart").GetCartData) => Promise<any>;
        loadCart: (cartData: import("./api/cart").LoadCartData) => Promise<any>;
        forgetCart: () => Promise<any>;
        updateCart: (cartData: import("./api/cart").UpdateCartData) => Promise<any>;
    };
    paymentSources: {
        addPaymentSource: (paymentSourceData: import("./api/payment-source").AddPaymentSourceData) => Promise<any>;
        setPrimaryPaymentSource: (paymentSourceData: import("./api/payment-source").SetPrimaryPaymentSourceData) => Promise<any>;
        deletePaymentSource: (paymentData: import("./api/payment-source").DeletePaymentSourceData) => Promise<any>;
    };
    payment: {
        completePayment: (paymentData: import("./api/payment").CompletePaymentData) => Promise<any>;
        pay: (paymentData: import("./api/payment").PayData) => Promise<any>;
    };
    subscriptions: {
        subscribe: (subscriptionData: import("./api/subscriptions").SubscribeData) => Promise<any>;
        cancel: (subscriptionData: import("./api/subscriptions").CancelData) => Promise<any>;
        switchPlan: (subscriptionData: import("./api/subscriptions").SwitchPlanData) => Promise<any>;
        reactivate: (subscriptionData: import("./api/subscriptions").ReactivateData) => Promise<any>;
    };
};
