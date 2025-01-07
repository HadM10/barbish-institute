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
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        <AppRoutes />
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
