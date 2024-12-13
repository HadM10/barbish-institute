import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/ClientSide/Home";
import Admin from "./pages/AdminPanel/Admin";

// Define AppRoutes
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<Admin />} />
  </Routes>
);

// Export the RoutesComponent
export default AppRoutes;
