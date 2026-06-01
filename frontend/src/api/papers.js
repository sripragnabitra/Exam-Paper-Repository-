import api from "./axios";

export const uploadPaper = (formData, token) =>
  api.post("/api/papers/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export const getPapers = (token) =>
  api.get("/api/papers", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const getPaper = (paperId, token) =>
  api.get(`/api/papers/${paperId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const downloadPaper = (paperId, token) =>
  api.get(`/api/papers/${paperId}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    responseType: "blob",
  });

// Search uses /api/search endpoint
export const searchPapers = (params) =>
  api.get("/api/search", { params });

export default { uploadPaper, getPapers, getPaper, downloadPaper, searchPapers };
