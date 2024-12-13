// Import necessary libraries
import React from 'react';

// Define the Sidebar component
// This component receives setActiveComponent as a prop for updating the active component in the AdminPanel
const Sidebar = ({ setActiveComponent }) => {
  return (
    <ul className="space-y-4 p-4">
      {/* List of sidebar navigation items */}
      {[
        { name: 'Dashboard', label: 'Dashboard' }, // Dashboard navigation item
        { name: 'Courses', label: 'Courses' }, // Courses navigation item
        { name: 'RecordedSessions', label: 'Recorded Sessions' }, // Recorded Sessions navigation item
        { name: 'Subscriptions', label: 'Subscriptions' }, // Subscriptions navigation item
        { name: 'BonusCards', label: 'Bonus Cards' }, // Bonus Cards navigation item
        { name: 'Users', label: 'Users' }, // Users navigation item
        { name: 'ContactUs', label: 'Contact Us' }, // Contact Us navigation item
      ].map(({ name, label }) => (
        // Render each navigation item
        <li
          key={name} // Unique key for each item
          onClick={() => setActiveComponent(name)} // Set active component when clicked
          className="cursor-pointer hover:bg-gray-200 p-2 rounded" // Styling for interactivity
        >
          {label} {/* Display the label of the navigation item */}
        </li>
      ))}
    </ul>
  );
};

// Export the Sidebar component for use in other parts of the app
export default Sidebar;
