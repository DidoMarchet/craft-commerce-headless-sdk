var P = Object.defineProperty;
var f = (t, s, e) => s in t ? P(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var h = (t, s, e) => (f(t, typeof s != "symbol" ? s + "" : s, e), e);
const S = (t) => /^[a-zA-Z0-9.-]+$/.test(t), b = (t, s) => {
  var r;
  if (!S(s))
    return null;
  const o = `; ${document.cookie}`.split(`; ${t}=`);
  return o.length === 2 && ((r = o.pop()) == null ? void 0 : r.split(";").shift()) || null;
};
class w extends Error {
  constructor(e, o, r) {
    super(e);
    h(this, "status");
    h(this, "data");
    this.name = "ApiError", this.status = o, this.data = r, Object.setPrototypeOf(this, w.prototype);
  }
}
const v = 1;
let i = null, d = "YOUR_API_BASE_URL";
d.endsWith("/") || (d += "/");
const A = async () => {
  if (i = b("CRAFT_CSRF_TOKEN", d), i)
    return i;
  const s = await fetch(`${d}actions/users/session-info`, {
    headers: { Accept: "application/json" },
    credentials: "include"
  });
  if (!s.ok) {
    const o = await s.json().catch(() => ({})), r = o.message || `Failed to fetch CSRF token with status ${s.status}`;
    throw new w(r, s.status, o);
  }
  return i = (await s.json()).csrfTokenValue, i;
}, R = ({ apiBaseUrl: t }) => {
  d = t.endsWith("/") ? t : `${t}/`;
  const s = async (o, r, c = {}, n = 0) => {
    try {
      i || (i = await A());
      const { accept: u = "application/json", contentType: l = "application/json", ...a } = c, m = r !== void 0 ? JSON.stringify(r) : void 0, p = await fetch(`${d}${o}`, {
        method: "POST",
        headers: {
          "Content-Type": l,
          Accept: u,
          "X-CSRF-Token": i,
          "X-Requested-With": "XMLHttpRequest",
          ...a
        },
        body: m,
        credentials: "include"
        // Include cookies in the request
      });
      if (!p.ok) {
        const y = await p.json().catch(() => ({}));
        if (console.error(`API POST error (${o}):`, y.message || "API request failed"), n < v && p.status === 400 && y.message === "Unable to verify your data submission.")
          return console.warn("CSRF token expired or invalid. Retrying..."), i = null, await s(o, r, c, n + 1);
        const g = y.message || `API request failed with status ${p.status}`;
        throw new w(g, p.status, y);
      }
      return u === "application/pdf" ? await p.blob() : await p.json();
    } catch (u) {
      throw console.error(u), u;
    }
  };
  return {
    post: s,
    get: async (o, r = {}, c = {}) => {
      try {
        const { accept: n = "application/json", ...u } = c, l = new URL(o, d);
        Object.keys(r).forEach((m) => {
          r[m] !== void 0 && r[m] !== null && l.searchParams.append(m, String(r[m]));
        });
        const a = await fetch(l.toString(), {
          method: "GET",
          headers: {
            Accept: n,
            "X-Requested-With": "XMLHttpRequest",
            ...u
          },
          credentials: "include"
        });
        if (!a.ok)
          throw console.error(`API GET error (${o}):`, await a.text()), await j(a);
        return n === "application/pdf" ? await a.blob() : await a.json();
      } catch (n) {
        throw console.error(n), n;
      }
    }
  };
}, j = async (t) => {
  let s = "API request failed";
  try {
    const e = await t.json();
    e.error ? s = e.error : e.errors ? typeof e.errors == "object" ? s = Object.values(e.errors).flat().join(", ") : s = e.errors : s = e.message || s;
  } catch {
    s = await t.text() || t.statusText || s;
  }
  return s = `(${t.status}) ${s}`, new Error(s);
}, E = (t) => ({
  loginUser: async (a) => await t.post("actions/users/login", a),
  saveUser: async (a) => await t.post("actions/users/save-user", a),
  uploadUserPhoto: async (a) => await t.post("actions/users/upload-user-photo", a),
  sendPasswordResetEmail: async (a) => await t.post(
    "actions/users/send-password-reset-email",
    a
  ),
  setPassword: async (a) => await t.post("actions/users/set-password", a),
  saveAddress: async (a) => await t.post("actions/users/save-address", a),
  deleteAddress: async (a) => await t.post("actions/users/delete-address", a),
  getSessionInfo: async () => await t.get("actions/users/session-info")
}), T = (t) => ({
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
}), $ = (t) => ({
  addPaymentSource: async (r) => await t.post(
    "actions/commerce/payment-sources/add",
    r
  ),
  setPrimaryPaymentSource: async (r) => await t.post(
    "actions/commerce/payment-sources/set-primary-payment-source",
    r
  ),
  deletePaymentSource: async (r) => await t.post(
    "actions/commerce/payment-sources/delete",
    r
  )
}), k = (t) => ({
  completePayment: async (o) => await t.get(
    "actions/commerce/payments/complete-payment",
    o
  ),
  pay: async (o) => await t.post("actions/commerce/payments/pay", o)
}), F = (t) => ({
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
}), x = ({
  apiBaseUrl: t
}) => {
  const s = R({ apiBaseUrl: t }), e = E(s), o = T(s), r = $(s), c = k(s), n = F(s);
  return {
    client: s,
    // Expose the client (if needed)
    users: e,
    // Expose the user functions
    cart: o,
    // Expose the cart functions
    paymentSources: r,
    // Expose the payment sources functions
    payment: c,
    // Expose the payment functions
    subscriptions: n
    // Expose the subscription functions
  };
};
export {
  x as craftCommerceHeadlessSdk
};
