import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Users= () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    console.log("triggering");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/all-users`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("data::::::::::;", data);
        setUsers(data.user); // Set user array to state
      } else {
        const data = await res.json();
        console.error("failed:", data.message);
      }
    } catch (error) {
      console.error("failed:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between"
        >
          <div className="font-semibold text-lg">{user.
firstName
}</div>
         
          <Link to={`/chat/${user._id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
            Message
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Users;
