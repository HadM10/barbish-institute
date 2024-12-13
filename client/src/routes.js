import { Route, Routes } from 'react-router-dom';
import Admin from './pages/AdminPanel/Admin';
import Home from './pages/ClientSide/Home';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default RoutesComponent;
