// src/components/Admin/Users.js
import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users] = useState([]);

  useEffect(() => {
   // Add code here to fetch data from the server

  }, []);

  const handleDelete = (id) => {
   //to delete user
  };

  return (
    <div className="users">
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>{user.name} - {user.email}</p>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
