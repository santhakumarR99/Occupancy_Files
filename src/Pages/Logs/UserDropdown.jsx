import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDropdown = () => {
  const [token, setToken] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const loginAndFetchUsers = async () => {
      try {
        // Login API to get token
        const loginResponse = await axios.post(
          "http://localhost:3000/auth/login",
          {
            username: "Occupancy",
            password: "Yuvi",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const receivedToken = loginResponse.data.token?.token;
        if (!receivedToken) {
          console.error("Token not received");
          return;
        }
        setToken(receivedToken);

        // Fetch users/events
        const userResponse = await axios.post(
          "http://localhost:3000/settings/logs/usersEvents",
          {
            vid: 4,
            username: "Occupancy",
          },
          {
            headers: {
              Authorization: `Bearer ${receivedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Adjust this part based on your API's response structure
        if (userResponse.data.success && Array.isArray(userResponse.data.users)) {
          // If API returns an array of user objects
          setUsernames(userResponse.data.users.map(u => u.username));
        } else if (userResponse.data.success && userResponse.data.user) {
          // Fallback for single user
          setUsernames([userResponse.data.user.username]);
        }
      } catch (error) {
        console.error("Error during login or user fetch:", error);
      }
    };

    loginAndFetchUsers();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <label htmlFor="userDropdown">Select User: </label>
      <select
        id="userDropdown"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">-- Choose a user --</option>
        {usernames.map((username, index) => (
          <option key={index} value={username}>
            {username}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserDropdown;