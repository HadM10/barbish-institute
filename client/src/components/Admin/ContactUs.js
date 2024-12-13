import React, { useState, useEffect } from 'react';

const ContactUs = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/api/messages')
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Error fetching messages:', error));
  }, []);

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <p>{message.userName} - {message.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactUs;