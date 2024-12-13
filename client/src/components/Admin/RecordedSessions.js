// Import necessary libraries and hooks
import React, { useState, useEffect } from 'react';

// Define the RecordedSessions component
const RecordedSessions = () => {
  // State to store the list of recorded sessions
  const [sessions, setSessions] = useState([]);

  // Fetch recorded sessions from the API when the component is mounted
  useEffect(() => {
    fetch('/api/recorded-sessions') // API endpoint for fetching sessions
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => setSessions(data)) // Update the state with the fetched sessions
      .catch((error) => console.error('Error fetching sessions:', error)); // Handle any errors
  }, []); // Empty dependency array ensures this effect runs only once

  // Handle deleting a session
  const handleDelete = (id) => {
    fetch(`/api/recorded-sessions/${id}`, { method: 'DELETE' }) // API endpoint for deleting a session
      .then(() => 
        // Remove the deleted session from the state
        setSessions((prev) => prev.filter((session) => session.id !== id))
      )
      .catch((error) => console.error('Error deleting session:', error)); // Handle any errors
  };

  return (
    <div className="recorded-sessions">
      {/* Page heading */}
      <h2>Recorded Sessions</h2>
      {/* List of recorded sessions */}
      <ul>
        {sessions.map((session) => (
          <li key={session.id}> {/* Unique key for each session */}
            <p>{session.title}</p> {/* Display the session title */}
            <button onClick={() => handleDelete(session.id)}>Delete</button> {/* Button to delete the session */}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the RecordedSessions component for use in other parts of the app
export default RecordedSessions;
