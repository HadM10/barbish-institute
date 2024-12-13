import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Define placeholder components to prevent compilation errors
const Placeholder = ({ name }) => <div>{name} Page is Under Development</div>;

// Define the RoutesComponent
const RoutesComponent = () => {
  return (
    <Routes>
      {/* Define routes with placeholder components */}
      <Route path="/" element={<Placeholder name="Home" />} />
      <Route path="/about" element={<Placeholder name="About" />} />
      <Route path="/dashboard" element={<Placeholder name="Dashboard" />} />
      <Route path="/contact" element={<Placeholder name="Contact Us" />} />
    </Routes>
  );
};

// Export the RoutesComponent
export default RoutesComponent;
