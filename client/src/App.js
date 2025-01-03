import React from "react";
import AppRoutes from "./routes";
import Navbar from "./components/User/Home/Navbar.js";
import "./css/tailwind.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <AppRoutes /> {/* Ensure this uses the Routes component */}
    </div>
  );
};

export default App;
