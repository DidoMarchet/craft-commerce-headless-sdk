var S = Object.defineProperty;
var v = (t, e, a) => e in t ? S(t, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : t[e] = a;
var y = (t, e, a) => (v(t, typeof e != "symbol" ? e + "" : e, a), a);
const R = (t) => /^[a-zA-Z0-9.-]+$/.test(t), T = (t, e) => {
  var s;
  if (!R(e))
    return null;
  const r = `; ${document.cookie}`.split(`; ${t}=`);
  return r.length === 2 && ((s = r.pop()) == null ? void 0 : s.split(";").shift()) || null;
};
class f extends Error {
  constructor(a, r, s, c, o, i) {
    super(a);
    y(this, "status");
    y(this, "data");
    y(this, "endpoint");
    y(this, "method");
    y(this, "retryCount");
    this.name = "ApiError", this.status = r, this.data = s, this.endpoint = c, this.method = o, this.retryCount = i, Object.setPrototypeOf(this, f.prototype);
  }
}
function w(t, ...e) {
  t && console.log(...e);
}
let u = null, d = !1, P = 1, h = "YOUR_API_BASE_URL";
function A(t) {
  return t.endsWith("/") ? t : t + "/";
}
async function j() {
  if (u || (u = T("CRAFT_CSRF_TOKEN", h)), u)
    return u;
  const e = await fetch(`${h}actions/users/session-info`, {
    headers: { Accept: "application/json" },
    credentials: "include"
  });
  if (!e.ok) {
    const r = await e.json().catch(() => ({})), s = r.message || `Failed to fetch CSRF token with status ${e.status}`;
    throw new f(s, e.status, r, "actions/users/session-info", "GET", 0);
  }
  return u = (await e.json()).csrfTokenValue, u;
}
async function C(t) {
  let e = "API request failed";
  try {
    const a = await t.json();
    a.error ? e = a.error : a.errors ? e = Object.values(a.errors).flat().join(", ") : e = a.message || e;
  } catch {
    e = await t.text() || t.statusText || e;
  }
  return e = `(${t.status}) ${e}`, new Error(e);
}
function E(t) {
  d = !!t.enableLogging, P = t.maxRetries ?? 1, h = A(t.apiBaseUrl), w(d, "Craft Commerce using base URL:", h);
  const e = async (r, s, c = {}, o = 0) => {
    try {
      u || (u = await j());
      const {
        accept: i = "application/json",
        contentType: l = "application/json",
        ...n
      } = c, m = s !== void 0 ? JSON.stringify(s) : void 0;
      w(d, "Craft Commerce POST request:", r, {
        retryCount: o,
        body: m
      });
      const p = await fetch(`${h}${r}`, {
        method: "POST",
        headers: {
          "Content-Type": l,
          Accept: i,
          "X-CSRF-Token": u,
          "X-Requested-With": "XMLHttpRequest",
          ...n
        },
        body: m,
        credentials: "include"
      });
      if (!p.ok) {
        const g = await p.json().catch(() => ({}));
        if (w(d, "Craft Commerce POST error data:", g), o < P && p.status === 400 && g.message === "Unable to verify your data submission.")
          return console.warn("CSRF token invalid. Retrying request..."), u = null, e(r, s, c, o + 1);
        const b = g.message || `API request failed with status ${p.status}`;
        throw new f(
          b,
          p.status,
          g,
          r,
          "POST",
          o
        );
      }
      return i === "application/pdf" ? await p.blob() : await p.json();
    } catch (i) {
      throw w(d, "Craft Commerce POST caught error:", i), i;
    }
  };
  return { post: e, get: async (r, s = {}, c = {}) => {
    try {
      const { accept: o = "application/json", ...i } = c, l = new URL(r, h);
      Object.keys(s).forEach((m) => {
        s[m] !== void 0 && s[m] !== null && l.searchParams.append(m, String(s[m]));
      }), w(d, "Craft Commerce GET request:", l.toString());
      const n = await fetch(l.toString(), {
        method: "GET",
        headers: {
          Accept: o,
          "X-Requested-With": "XMLHttpRequest",
          ...i
        },
        credentials: "include"
      });
      if (!n.ok)
        throw console.error(`API GET error (${r}):`, await n.text()), await C(n);
      return o === "application/pdf" ? await n.blob() : await n.json();
    } catch (o) {
      throw w(d, "Craft Commerce GET caught error:", o), o;
    }
  } };
}
const U = (t) => ({
  loginUser: async (n) => await t.post("actions/users/login", n),
  saveUser: async (n) => await t.post("actions/users/save-user", n),
  uploadUserPhoto: async (n) => await t.post("actions/users/upload-user-photo", n),
  sendPasswordResetEmail: async (n) => await t.post(
    "actions/users/send-password-reset-email",
    n
  ),
  setPassword: async (n) => await t.post("actions/users/set-password", n),
  saveAddress: async (n) => await t.post("actions/users/save-address", n),
  deleteAddress: async (n) => await t.post("actions/users/delete-address", n),
  getSessionInfo: async () => await t.get("actions/users/session-info")
}), k = (t) => ({
  completeCart: async (o) => await t.post("actions/commerce/cart/complete", o),
  getCart: async () => await t.get("actions/commerce/cart/get-cart"),
  loadCart: async (o) => await t.post("actions/commerce/cart/load-cart", o),
  forgetCart: async () => await t.post(
    "actions/commerce/cart/forget-cart",
    void 0,
    {
      accept: "text/html"
    }
  ),
  updateCart: async (o) => await t.post(
    "actions/commerce/cart/update-cart",
    o
  )
}), O = (t) => ({
  addPaymentSource: async (s) => await t.post(
    "actions/commerce/payment-sources/add",
    s
  ),
  setPrimaryPaymentSource: async (s) => await t.post(
    "actions/commerce/payment-sources/set-primary-payment-source",
    s
  ),
  deletePaymentSource: async (s) => await t.post(
    "actions/commerce/payment-sources/delete",
    s
  )
}), F = (t) => ({
  completePayment: async (r) => await t.get(
    "actions/commerce/payments/complete-payment",
    r
  ),
  pay: async (r) => await t.post("actions/commerce/payments/pay", r)
}), $ = (t) => ({
  subscribe: async (c) => await t.post(
    "actions/commerce/subscriptions/subscribe",
    c
  ),
  cancel: async (c) => await t.post(
    "actions/commerce/subscriptions/cancel",
    c
  ),
  switchPlan: async (c) => await t.post(
    "actions/commerce/subscriptions/switch",
    c
  ),
  reactivate: async (c) => await t.post(
    "actions/commerce/subscriptions/reactivate",
    c
  )
}), q = ({
  apiBaseUrl: t
}) => {
  const e = E({ apiBaseUrl: t }), a = U(e), r = k(e), s = O(e), c = F(e), o = $(e);
  return {
    client: e,
    // Expose the client (if needed)
    users: a,
    // Expose the user functions
    cart: r,
    // Expose the cart functions
    paymentSources: s,
    // Expose the payment sources functions
    payment: c,
    // Expose the payment functions
    subscriptions: o
    // Expose the subscription functions
  };
};
export {
  q as craftCommerceHeadlessSdk
};
