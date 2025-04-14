var S = Object.defineProperty;
var b = (t, s, r) => s in t ? S(t, s, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[s] = r;
var g = (t, s, r) => (b(t, typeof s != "symbol" ? s + "" : s, r), r);
const v = (t) => /^[a-zA-Z0-9.-]+$/.test(t), E = (t, s) => {
  var e;
  if (!v(s))
    return null;
  const o = `; ${document.cookie}`.split(`; ${t}=`);
  return o.length === 2 && ((e = o.pop()) == null ? void 0 : e.split(";").shift()) || null;
};
class l extends Error {
  constructor(r, o, e, a, u, c) {
    super(r);
    g(this, "status");
    g(this, "data");
    g(this, "endpoint");
    g(this, "method");
    g(this, "retryCount");
    this.name = "CraftCommerceSdkError", this.status = o, this.data = e, this.endpoint = a, this.method = u, this.retryCount = c, Object.setPrototypeOf(this, l.prototype);
  }
}
function f(t, ...s) {
  t && console.log(...s);
}
function C(t) {
  return t.endsWith("/") ? t : t + "/";
}
async function R(t, s) {
  let o = E("CRAFT_CSRF_TOKEN", t);
  if (o)
    return o;
  const e = await fetch(`${t}actions/users/session-info`, {
    headers: { Accept: "application/json" },
    credentials: "include"
  });
  if (!e.ok) {
    const u = await e.json().catch(() => ({})), c = u.message || `Failed to fetch CSRF token with status ${e.status}`;
    throw new l(c, e.status, u, "actions/users/session-info", "GET", 0);
  }
  return (await e.json()).csrfTokenValue;
}
async function k(t, s, r, o) {
  let e = "API request failed", a = {};
  try {
    (t.headers.get("Content-Type") || "").includes("application/json") ? (a = await t.json(), a.error ? e = a.error : a.errors ? e = Object.values(a.errors).flat().join(", ") : e = a.message || e) : e = await t.text() || t.statusText || e;
  } catch {
    e = t.statusText || e;
  }
  return e = `(${t.status}) ${e}`, new l(e, t.status, a, s, r, o);
}
function x(t) {
  const s = !!t.enableLogging, r = t.maxRetries ?? 1, o = C(t.apiBaseUrl);
  let e = null;
  f(s, "Craft Commerce using base URL:", o);
  const a = async (c, p, n = {}, m = 0) => {
    try {
      e || (e = await R(o, s));
      const {
        accept: d = "application/json",
        contentType: T = "application/json",
        ...w
      } = n, y = p !== void 0 ? JSON.stringify(p) : void 0;
      f(s, "Craft Commerce POST request:", c, { retryCount: m, body: y });
      const i = await fetch(`${o}${c}`, {
        method: "POST",
        headers: {
          "Content-Type": T,
          Accept: d,
          "X-CSRF-Token": e,
          "X-Requested-With": "XMLHttpRequest",
          ...w
        },
        body: y,
        credentials: "include"
      });
      if (!i.ok) {
        let h = {};
        if ((i.headers.get("Content-Type") || "").includes("application/json") ? h = await i.json().catch(() => ({})) : h = { message: await i.text() }, f(s, "Craft Commerce POST error data:", h), m < r && i.status === 400 && h.message === "Unable to verify your data submission.")
          return console.warn("CSRF token invalid. Retrying request..."), e = null, a(c, p, n, m + 1);
        throw new l(
          h.message || `API request failed with status ${i.status}`,
          i.status,
          h,
          c,
          "POST",
          m
        );
      }
      if (d === "application/pdf")
        return await i.blob();
      const P = await i.text();
      if (!P)
        throw new l(`(${i.status}) Empty response`, i.status, {}, c, "POST", m);
      try {
        return JSON.parse(P);
      } catch {
        return P;
      }
    } catch (d) {
      throw f(s, "Craft Commerce POST caught error:", d), d instanceof l ? d : new l(
        d.message || "Unknown error",
        0,
        {},
        c,
        "POST",
        m
      );
    }
  };
  return { post: a, get: async (c, p = {}, n = {}) => {
    try {
      const { accept: m = "application/json", ...d } = n, T = new URL(c, o);
      Object.keys(p).forEach((i) => {
        p[i] !== void 0 && p[i] !== null && T.searchParams.append(i, String(p[i]));
      }), f(s, "Craft Commerce GET request:", T.toString());
      const w = await fetch(T.toString(), {
        method: "GET",
        headers: {
          Accept: m,
          "X-Requested-With": "XMLHttpRequest",
          ...d
        },
        credentials: "include"
      });
      if (!w.ok)
        throw console.error(`API GET error (${c}):`, await w.text()), await k(w, c, "GET", 0);
      if (m === "application/pdf")
        return await w.blob();
      const y = await w.text();
      if (!y)
        throw new l(`(${w.status}) Empty response`, w.status, {}, c, "GET", 0);
      try {
        return JSON.parse(y);
      } catch {
        return y;
      }
    } catch (m) {
      throw f(s, "Craft Commerce GET caught error:", m), m instanceof l ? m : new l(
        m.message || "Unknown error",
        0,
        {},
        c,
        "GET",
        0
      );
    }
  } };
}
const O = (t) => ({
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
}), j = (t) => ({
  completeCart: async (u) => await t.post("actions/commerce/cart/complete", u),
  getCart: async () => await t.get("actions/commerce/cart/get-cart"),
  loadCart: async (u) => await t.post("actions/commerce/cart/load-cart", u),
  forgetCart: async () => await t.post(
    "actions/commerce/cart/forget-cart",
    void 0,
    {
      accept: "text/html"
    }
  ),
  updateCart: async (u) => await t.post(
    "actions/commerce/cart/update-cart",
    u
  )
}), U = (t) => ({
  addPaymentSource: async (e) => await t.post(
    "actions/commerce/payment-sources/add",
    e
  ),
  setPrimaryPaymentSource: async (e) => await t.post(
    "actions/commerce/payment-sources/set-primary-payment-source",
    e
  ),
  deletePaymentSource: async (e) => await t.post(
    "actions/commerce/payment-sources/delete",
    e
  )
}), $ = (t) => ({
  completePayment: async (o) => await t.get(
    "actions/commerce/payments/complete-payment",
    o
  ),
  pay: async (o) => await t.post("actions/commerce/payments/pay", o)
}), A = (t) => ({
  subscribe: async (a) => await t.post(
    "actions/commerce/subscriptions/subscribe",
    a
  ),
  cancel: async (a) => await t.post(
    "actions/commerce/subscriptions/cancel",
    a
  ),
  switchPlan: async (a) => await t.post(
    "actions/commerce/subscriptions/switch",
    a
  ),
  reactivate: async (a) => await t.post(
    "actions/commerce/subscriptions/reactivate",
    a
  )
}), G = ({
  apiBaseUrl: t,
  enableLogging: s = !1,
  maxRetries: r
}) => {
  const e = x({
    apiBaseUrl: t,
    enableLogging: !!s,
    maxRetries: r
  }), a = O(e), u = j(e), c = U(e), p = $(e), n = A(e);
  return {
    client: e,
    users: a,
    cart: u,
    paymentSources: c,
    payment: p,
    subscriptions: n
  };
};
export {
  j as cart,
  G as craftCommerceHeadlessSdk,
  $ as payment,
  U as paymentSources,
  A as subscriptions,
  O as users
};
