import React from "react";
import AppRoutes from "./routes";
import "./css/tailwind.css";

const App = () => {
  return (
    <div>
      <AppRoutes /> {/* Ensure this uses the Routes component */}
    </div>
  );
};

export default App;
