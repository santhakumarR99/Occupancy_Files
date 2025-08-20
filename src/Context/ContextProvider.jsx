import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name: "Admin", role: "admin" }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage
    const name = sessionStorage.getItem("name");
    const role = sessionStorage.getItem("role");
    // URL = import.meta.env.VITE_API_URL;
    if (name && role) {
      setUser({ name, role });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

 
  const login = (name, role) => {
    const names = sessionStorage.getItem("name");
    const roles = sessionStorage.getItem("role");
    setUser({ name: names, role: roles });
    console.log(user);
  };
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
