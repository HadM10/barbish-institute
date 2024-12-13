// src/components/Admin/RecordedSessions.js
import React, { useState, useEffect } from 'react';

const RecordedSessions = () => {
  const [sessions] = useState([]);

  useEffect(() => {
    // هنا نضيف الكود لعمل Fetch من السيرفر
  }, []);

  const handleDelete = (id) => {
    // الكود لحذف الجلسة
  };

  return (
    <div className="recorded-sessions">
      <h2>Recorded Sessions</h2>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            <p>{session.title}</p>
            <button onClick={() => handleDelete(session.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordedSessions;
