import React from 'react';
import Navbar from './components/User/Home/Navbar.js';
import './css/tailwind.css';
import RoutesComponent from './routes';

const App = () => {
  return (
    <div>
      <Navbar />
      <RoutesComponent />
    </div>
  );
};
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default App;
