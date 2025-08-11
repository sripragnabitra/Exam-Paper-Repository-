import api from "./axios";

export const getMe = (token) =>
  api.get("/api/auth/me", { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const getGoogleAuthUrl = () => `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`;
