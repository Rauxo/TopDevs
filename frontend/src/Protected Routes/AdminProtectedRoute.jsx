import React from "react";
import { Navigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <AdminLogin />;
  }

  return children;
};

export default AdminProtectedRoute;
