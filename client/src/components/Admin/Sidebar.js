import React from 'react';

const Sidebar = ({ setActiveComponent }) => {
  return (
    <ul className="space-y-4 p-4">
      {[
        { name: 'Dashboard', label: 'Dashboard' },
        { name: 'Courses', label: 'Courses' },
        { name: 'RecordedSessions', label: 'Recorded Sessions' },
        { name: 'Subscriptions', label: 'Subscriptions' },
        { name: 'BonusCards', label: 'Bonus Cards' },
        { name: 'Users', label: 'Users' },
        { name: 'ContactUs', label: 'Contact Us' },
      ].map(({ name, label }) => (
        <li
          key={name}
          onClick={() => setActiveComponent(name)}
          className="cursor-pointer hover:bg-gray-200 p-2 rounded"
        >
          {label}
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;