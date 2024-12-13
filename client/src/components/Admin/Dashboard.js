import React from 'react';
import '../../css/tailwind.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <p>Total Users: 120</p>
        <p>Total Subscriptions: 50</p>
      </div>
    </div>
  );
};export default Dashboard;