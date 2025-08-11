import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import apiAxios from "../api/axios";
import { getGoogleAuthUrl } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // auto fetch user if token exists
    if (token) {
      apiAxios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => logout());
      // create socket connection
      const s = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        auth: { token },
        transports: ["websocket"],
      });
      setSocket(s);
      return () => s.disconnect();
    }
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const googleAuthUrl = getGoogleAuthUrl();

  return (
    <AuthContext.Provider value={{ user, token, login, logout, googleAuthUrl, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
