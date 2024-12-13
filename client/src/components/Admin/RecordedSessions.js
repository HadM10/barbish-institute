import React, { useState, useEffect } from 'react';

const RecordedSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch('/api/recorded-sessions')
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .catch((error) => console.error('Error fetching sessions:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/recorded-sessions/${id}`, { method: 'DELETE' })
      .then(() => setSessions((prev) => prev.filter((session) => session.id !== id)))
      .catch((error) => console.error('Error deleting session:', error));
  };

  return (
    <div className="recorded-sessions">
      <h2>Recorded Sessions</h2>
      <ul>
        {sessions.map((session) => (
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