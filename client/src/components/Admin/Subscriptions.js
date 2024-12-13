// src/components/Admin/Subscriptions.js
import React, { useState, useEffect } from 'react';

const Subscriptions = () => {
  const [subscriptions] = useState([]);

  useEffect(() => {
    // Add code here to fetch data from the server
  }, []);

  return (
    <div className="subscriptions">
      <h2>Subscriptions</h2>
      <ul>
        {subscriptions.map(sub => (
          <li key={sub.id}>
            <p>{sub.userName} - {sub.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscriptions;
