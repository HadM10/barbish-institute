import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes'; // Import AppRoutes

const App = () => {
  return (
    <Router>
      {/* Render AppRoutes for managing all routes */}
      <AppRoutes />
    </Router>
  );
};

export default App;
