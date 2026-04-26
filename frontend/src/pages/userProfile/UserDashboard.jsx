import React, { useContext } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <>
      <img src={`http://localhost:5000/${user.profileImg}`} alt="profile" width="100" />
      <div>Hello {user.username}</div>
      <div>Your mail is {user.email}</div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default UserDashboard;
