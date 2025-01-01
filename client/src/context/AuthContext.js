import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Ensure correct import
import { login as apiLogin } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuth(null);
    navigate("/"); // Redirect to home on logout
  }, [navigate]);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          logout(); // Token expired
        } else {
          setAuth({
            token,
            username: decodedToken.username,
            role: decodedToken.role, // Ensure role is properly included in token
          });

          // Check if the user is trying to access /admin and is not an admin
          if (
            decodedToken.role !== "admin" &&
            window.location.pathname === "/admin"
          ) {
            navigate("/", {
              state: { message: "You do not have access to this page." },
            });
          }
        }
      } catch (error) {
        logout(); // Invalid token or error in decoding
      }
    }else {
      // No token found - Allow access to all pages except /admin
      if (window.location.pathname === "/admin") {
        navigate("/", {
          state: { message: "You do not have access to this page." },
        });
      }
      setAuth(null); // If no token, set auth to null
      // Do not navigate away for non-admin pages
    }
    setLoading(false); // Set loading to false after check
  }, [logout, navigate]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const login = async (userData) => {
    try {
      const { token, role } = await apiLogin(userData); // Call API to log in the user
      const decodedToken = jwtDecode(token);

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Update the auth state
      setAuth({
        token,
        username: decodedToken.username,
        role: decodedToken.role, // Use the role from the backend (admin or user)
      });

      if (role === "admin") {
        navigate("/admin"); // Redirect admin to /admin page
      } else {
        navigate("/"); // Redirect regular user to home
      }  

      return { token, role, status: "success" }; // Return login response
    } catch (error) {
      console.error("Login error:", error); // Debugging login error
      return { status: "error", message: error.message }; // Return error status and message
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
