// Import necessary libraries and styles
import React from 'react';
import '../../css/tailwind.css'; // Import Tailwind CSS for styling

// Define the Dashboard component
const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Page heading */}
      <h1>Admin Dashboard</h1>
      {/* Section displaying statistics */}
      <div className="stats">
        <p>Total Users: 120</p> {/* Display total number of users */}
        <p>Total Subscriptions: 50</p> {/* Display total number of subscriptions */}
      </div>
    </div>
  );
};

// Export the Dashboard component for use in other parts of the app
export default Dashboard;
