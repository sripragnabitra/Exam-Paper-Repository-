import api from "./axios";

export const fetchNotifications = (token) =>
  api.get("/api/notifications", { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const markRead = (id, token) =>
  api.post(`/api/notifications/${id}/read`, {}, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export default { fetchNotifications, markRead };