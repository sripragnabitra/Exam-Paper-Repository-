import api from "./axios";

export const fetchPendingPapers = (token) =>
  api.get("/api/admin/papers/pending", { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const approvePaper = (id, token) =>
  api.post(`/api/admin/papers/${id}/approve`, {}, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const rejectPaper = (id, reason, token) =>
  api.post(`/api/admin/papers/${id}/reject`, { reason }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const fetchUsers = (token) =>
  api.get("/api/admin/users", { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const updateUserCredits = (userId, amount, token) =>
  api.post(`/api/admin/users/${userId}/credits`, { amount }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
