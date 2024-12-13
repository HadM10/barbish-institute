// Import necessary libraries and components
import React, { useState } from 'react'; // Import React and useState hook for managing component state
import Dashboard from '../../components/Admin/Dashboard'; // Dashboard component
import Courses from '../../components/Admin/Courses'; // Courses component
import RecordedSessions from '../../components/Admin/RecordedSessions'; // RecordedSessions component
import Subscriptions from '../../components/Admin/Subscriptions'; // Subscriptions component
import BonusCards from '../../components/Admin/BonusCards'; // BonusCards component
import Users from '../../components/Admin/Users'; // Users management component
import ContactUs from '../../components/Admin/ContactUs'; // ContactUs component
import Sidebar from '../../components/Admin/Sidebar'; // Sidebar for navigation

// Define the AdminPanel component
const AdminPanel = () => {
  // State to track the currently active component
  const [activeComponent, setActiveComponent] = useState('Dashboard');

  // Function to render the active component based on the current state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard': // If active component is Dashboard
        return <Dashboard />;
      case 'Courses': // If active component is Courses
        return <Courses />;
      case 'RecordedSessions': // If active component is Recorded Sessions
        return <RecordedSessions />;
      case 'Subscriptions': // If active component is Subscriptions
        return <Subscriptions />;
      case 'BonusCards': // If active component is BonusCards
        return <BonusCards />;
      case 'Users': // If active component is Users
        return <Users />;
      case 'ContactUs': // If active component is Contact Us
        return <ContactUs />;
      default: // If no matching component is found
        return <div>Component not found</div>;
    }
  };

  // Main structure of the Admin Panel
  return (
    <div className="admin-panel flex">
      {/* Sidebar for navigation, passes setActiveComponent to allow updates */}
      <Sidebar setActiveComponent={setActiveComponent} />
      {/* Content area to display the currently active component */}
      <div className="content flex-1 p-4">{renderComponent()}</div>
    </div>
  );
};

// Export the AdminPanel component for use in other parts of the app
export default AdminPanel;
