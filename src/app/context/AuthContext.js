"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const response = await fetch(
          "http://localhost:5000/users/current-user",
          {
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Auth check successful:', userData);
          setUser(userData);
        } else {
          console.log('Auth check failed:', response.status);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    setUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
