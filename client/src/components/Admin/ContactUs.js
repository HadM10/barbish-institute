// Import necessary libraries and hooks
import React, { useState, useEffect } from 'react';

// Define the ContactUs component
const ContactUs = () => {
  // State to store the list of messages from users
  const [messages, setMessages] = useState([]);

  // Fetch messages from the API when the component is mounted
  useEffect(() => {
    fetch('/api/messages') // API endpoint for fetching messages
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => setMessages(data)) // Update the state with the fetched messages
      .catch((error) => console.error('Error fetching messages:', error)); // Handle any errors
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="contact-us">
      {/* Page heading */}
      <h2>Contact Us</h2>
      {/* List of user messages */}
      <ul>
        {messages.map((message) => (
          <li key={message.id}> {/* Unique key for each message */}
            <p>
              {message.userName} - {message.message} {/* Display the user's name and message */}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the ContactUs component for use in other parts of the app
export default ContactUs;
