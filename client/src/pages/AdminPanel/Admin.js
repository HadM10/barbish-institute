import React, { useState } from 'react';
import Dashboard from '../../components/Admin/Dashboard';
import Courses from '../../components/Admin/Courses';
import RecordedSessions from '../../components/Admin/RecordedSessions';
import Subscriptions from '../../components/Admin/Subscriptions';
import BonusCards from '../../components/Admin/BonusCards';
import Users from '../../components/Admin/Users';
import ContactUs from '../../components/Admin/ContactUs';
import Sidebar from '../../components/Admin/Sidebar';

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState('Dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Courses':
        return <Courses />;
      case 'RecordedSessions':
        return <RecordedSessions />;
      case 'Subscriptions':
        return <Subscriptions />;
      case 'BonusCards':
        return <BonusCards />;
      case 'Users':
        return <Users />;
      case 'ContactUs':
        return <ContactUs />;
      default:
        return <div>Component not found</div>;
    }
  };

  return (
    <div className="admin-panel flex">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="content flex-1 p-4">{renderComponent()}</div>
    </div>
  );
};

export default AdminPanel;