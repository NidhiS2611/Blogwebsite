import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../services/Axiosinstance";

const Authcontext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTO LOGIN
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get(
          "/user/me",
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (err) {
        setUser(null); // ❌ redirect yaha nahi
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post(
      "/user/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post(
      "/user/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <Authcontext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </Authcontext.Provider>
  );
}

export const useAuth = () => useContext(Authcontext);
