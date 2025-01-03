import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "./components/User/Home/Navbar.js";
import Footer from "./components/User/Home/Footer.js";
import "./css/tailwind.css";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
