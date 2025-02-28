const w = (t) => /^[a-zA-Z0-9.-]+$/.test(t), h = (t, n) => {
  var o;
  if (!w(n))
    return null;
  const a = `; ${document.cookie}`.split(`; ${t}=`);
  return a.length === 2 && ((o = a.pop()) == null ? void 0 : o.split(";").shift()) || null;
}, g = ({ apiBaseUrl: t }) => {
  t.endsWith("/") || (t += "/");
  let r = h("CRAFT_CSRF_TOKEN", t);
  const a = async () => {
    const s = await fetch(`${t}actions/users/session-info`, {
      headers: { Accept: "application/json" },
      credentials: "include"
      // Include cookies in the request
    });
    if (!s.ok) {
      const p = await s.json().catch(() => ({}));
      throw console.error(p), new Error("Failed to fetch CSRF token");
    }
    return r = (await s.json()).csrfTokenValue, r;
  }, o = async (s, u, p = {}) => {
    try {
      r || (r = await a());
      const {
        accept: e = "application/json",
        contentType: y = "application/json",
        ...d
      } = p, m = u !== void 0 ? JSON.stringify(u) : void 0, c = await fetch(`${t}${s}`, {
        method: "POST",
        headers: {
          "Content-Type": y,
          Accept: e,
          "X-CSRF-Token": r,
          "X-Requested-With": "XMLHttpRequest",
          ...d
        },
        body: m,
        credentials: "include"
        // Include cookies in the request
      });
      if (!c.ok) {
        const l = await c.json().catch(() => ({}));
        return console.error(l.message || "API request failed"), c.status === 400 && l.message === "Unable to verify your data submission." ? (console.warn("CSRF token expired or invalid. Refreshing token..."), r = null, await o(s, u)) : l;
      }
      return e === "application/pdf" ? await c.blob() : await c.json();
    } catch (e) {
      throw console.error("Error making POST request:", e), e;
    }
  };
  return {
    post: o,
    get: async (s, u = {}, p = {}) => {
      try {
        const { accept: e = "application/json", ...y } = p, d = new URL(s, t);
        Object.keys(u).forEach((c) => {
          u[c] !== void 0 && u[c] !== null && d.searchParams.append(c, String(u[c]));
        });
        const m = await fetch(d.toString(), {
          method: "GET",
          headers: {
            Accept: e,
            "X-Requested-With": "XMLHttpRequest",
            ...y
          },
          credentials: "include"
          // Include cookies in the request
        });
        if (!m.ok) {
          const c = await m.json().catch(() => ({}));
          return console.error(c.message || "API request failed"), c;
        }
        return e === "application/pdf" ? await m.blob() : await m.json();
      } catch (e) {
        throw console.error("Error making GET request:", e), e;
      }
    }
  };
}, P = (t) => ({
  loginUser: async (e) => await t.post("actions/users/login", e),
  saveUser: async (e) => await t.post("actions/users/save-user", e),
  uploadUserPhoto: async (e) => await t.post("actions/users/upload-user-photo", e),
  sendPasswordResetEmail: async (e) => await t.post(
    "actions/users/send-password-reset-email",
    e
  ),
  setPassword: async (e) => await t.post("actions/users/set-password", e),
  saveAddress: async (e) => await t.post("actions/users/save-address", e),
  deleteAddress: async (e) => await t.post("actions/users/delete-address", e),
  getSessionInfo: async () => await t.get("actions/users/session-info")
}), b = (t) => ({
  completeCart: async (s) => await t.post("actions/commerce/cart/complete", s),
  getCart: async () => await t.get("actions/commerce/cart/get-cart"),
  loadCart: async (s) => await t.post("actions/commerce/cart/load-cart", s),
  forgetCart: async () => await t.post(
    "actions/commerce/cart/forget-cart",
    void 0,
    {
      accept: "text/html"
    }
  ),
  updateCart: async (s) => await t.post(
    "actions/commerce/cart/update-cart",
    s
  )
}), S = (t) => ({
  addPaymentSource: async (o) => await t.post(
    "actions/commerce/payment-sources/add",
    o
  ),
  setPrimaryPaymentSource: async (o) => await t.post(
    "actions/commerce/payment-sources/set-primary-payment-source",
    o
  ),
  deletePaymentSource: async (o) => await t.post(
    "actions/commerce/payment-sources/delete",
    o
  )
}), f = (t) => ({
  completePayment: async (a) => await t.get(
    "actions/commerce/payments/complete-payment",
    a
  ),
  pay: async (a) => await t.post("actions/commerce/payments/pay", a)
}), v = (t) => ({
  subscribe: async (i) => await t.post(
    "actions/commerce/subscriptions/subscribe",
    i
  ),
  cancel: async (i) => await t.post(
    "actions/commerce/subscriptions/cancel",
    i
  ),
  switchPlan: async (i) => await t.post(
    "actions/commerce/subscriptions/switch",
    i
  ),
  reactivate: async (i) => await t.post(
    "actions/commerce/subscriptions/reactivate",
    i
  )
}), k = ({
  apiBaseUrl: t
}) => {
  const n = g({ apiBaseUrl: t }), r = P(n), a = b(n), o = S(n), i = f(n), s = v(n);
  return {
    client: n,
    // Expose the client (if needed)
    users: r,
    // Expose the user functions
    cart: a,
    // Expose the cart functions
    paymentSources: o,
    // Expose the payment sources functions
    payment: i,
    // Expose the payment functions
    subscriptions: s
    // Expose the subscription functions
  };
};
export {
  k as craftCommerceHeadlessSdk
};
