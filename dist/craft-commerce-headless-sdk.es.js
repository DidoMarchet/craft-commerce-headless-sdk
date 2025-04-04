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
  constructor(a, r, s, c, n, i) {
    super(a);
    y(this, "status");
    y(this, "data");
    y(this, "endpoint");
    y(this, "method");
    y(this, "retryCount");
    this.name = "ApiError", this.status = r, this.data = s, this.endpoint = c, this.method = n, this.retryCount = i, Object.setPrototypeOf(this, f.prototype);
  }
}
function w(t, ...e) {
  t && console.log(...e);
}
let u = null, d = !1, b = 1, h = "YOUR_API_BASE_URL";
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
  d = !!t.enableLogging, b = t.maxRetries ?? 1, h = A(t.apiBaseUrl), w(d, "Craft Commerce using base URL:", h);
  const e = async (r, s, c = {}, n = 0) => {
    try {
      u || (u = await j());
      const {
        accept: i = "application/json",
        contentType: m = "application/json",
        ...o
      } = c, p = s !== void 0 ? JSON.stringify(s) : void 0;
      w(d, "Craft Commerce POST request:", r, {
        retryCount: n,
        body: p
      });
      const l = await fetch(`${h}${r}`, {
        method: "POST",
        headers: {
          "Content-Type": m,
          Accept: i,
          "X-CSRF-Token": u,
          "X-Requested-With": "XMLHttpRequest",
          ...o
        },
        body: p,
        credentials: "include"
      });
      if (!l.ok) {
        const g = await l.json().catch(() => ({}));
        if (w(d, "Craft Commerce POST error data:", g), n < b && l.status === 400 && g.message === "Unable to verify your data submission.")
          return console.warn("CSRF token invalid. Retrying request..."), u = null, e(r, s, c, n + 1);
        const P = g.message || `API request failed with status ${l.status}`;
        throw new f(
          P,
          l.status,
          g,
          r,
          "POST",
          n
        );
      }
      return i === "application/pdf" ? await l.blob() : await l.json();
    } catch (i) {
      throw w(d, "Craft Commerce POST caught error:", i), i;
    }
  };
  return { post: e, get: async (r, s = {}, c = {}) => {
    try {
      const { accept: n = "application/json", ...i } = c, m = new URL(r, h);
      Object.keys(s).forEach((p) => {
        s[p] !== void 0 && s[p] !== null && m.searchParams.append(p, String(s[p]));
      }), w(d, "Craft Commerce GET request:", m.toString());
      const o = await fetch(m.toString(), {
        method: "GET",
        headers: {
          Accept: n,
          "X-Requested-With": "XMLHttpRequest",
          ...i
        },
        credentials: "include"
      });
      if (!o.ok)
        throw console.error(`API GET error (${r}):`, await o.text()), await C(o);
      return n === "application/pdf" ? await o.blob() : await o.json();
    } catch (n) {
      throw w(d, "Craft Commerce GET caught error:", n), n;
    }
  } };
}
const U = (t) => ({
  loginUser: async (o) => await t.post("actions/users/login", o),
  saveUser: async (o) => await t.post("actions/users/save-user", o),
  uploadUserPhoto: async (o) => await t.post("actions/users/upload-user-photo", o),
  sendPasswordResetEmail: async (o) => await t.post(
    "actions/users/send-password-reset-email",
    o
  ),
  setPassword: async (o) => await t.post("actions/users/set-password", o),
  saveAddress: async (o) => await t.post("actions/users/save-address", o),
  deleteAddress: async (o) => await t.post("actions/users/delete-address", o),
  getSessionInfo: async () => await t.get("actions/users/session-info")
}), k = (t) => ({
  completeCart: async (n) => await t.post("actions/commerce/cart/complete", n),
  getCart: async () => await t.get("actions/commerce/cart/get-cart"),
  loadCart: async (n) => await t.post("actions/commerce/cart/load-cart", n),
  forgetCart: async () => await t.post(
    "actions/commerce/cart/forget-cart",
    void 0,
    {
      accept: "text/html"
    }
  ),
  updateCart: async (n) => await t.post(
    "actions/commerce/cart/update-cart",
    n
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
}), L = ({
  apiBaseUrl: t,
  enableLogging: e = !1,
  maxRetries: a
}) => {
  const s = E({
    apiBaseUrl: t,
    enableLogging: !!e,
    maxRetries: a
  }), c = U(s), n = k(s), i = O(s), m = F(s), o = $(s);
  return {
    client: s,
    users: c,
    cart: n,
    paymentSources: i,
    payment: m,
    subscriptions: o
  };
};
export {
  k as cart,
  L as craftCommerceHeadlessSdk,
  F as payment,
  O as paymentSources,
  $ as subscriptions,
  U as users
};
