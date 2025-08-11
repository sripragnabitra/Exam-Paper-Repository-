import api from "./axios";

export const createCheckout = (planId, token) =>
  api.post("/api/payments/checkout", { planId }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

// webhook handling and client token retrieval would be server-side; this is a client starter.
