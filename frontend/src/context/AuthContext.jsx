import { createContext, useState, useEffect, useCallback } from "react";
import apiAxios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  }, []);

  useEffect(() => {
    if (token) {
      apiAxios
        .get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, logout]);

  const login = useCallback((jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  }, []);

  const googleAuthUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, googleAuthUrl, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
