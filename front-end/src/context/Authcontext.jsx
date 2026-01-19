


import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const Authcontext = createContext(
  {
    user: null, login: async () => {}, logout: async () => {}, setUser: () => {},
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // Auto 
    // 🔐 AUTO LOGIN + JWT EXPIRE HANDLING
  useEffect(() => {
    axios
      .get("http://localhost:3000/user/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        setUser(null);
        setLoading(false);

        // ✅ JWT expired → redirect
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      });
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/user/login",
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
     
      
      return res.data; // IMPORTANT
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    await axios.post(
      "http://localhost:3000/user/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <Authcontext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </Authcontext.Provider>
  );
}

export const useAuth = () => useContext(Authcontext);