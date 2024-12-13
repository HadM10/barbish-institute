import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure correct import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/login');
  }, [navigate]);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          setAuth({
            token,
            username: decodedToken.username,
            email: decodedToken.email, // Extract username from token
            role: decodedToken.role, // Extract role from token
          });
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false); // Set loading to false after check
  }, [logout]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem('token', token);
    setAuth({
      token,
      username: decodedToken.username, // Extract username from token
      role: decodedToken.role, // Extract role from token
    });
    navigate('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>{children}</AuthContext.Provider>
  );
};