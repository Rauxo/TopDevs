import React, { useContext } from "react";
import { AuthContext } from "../API/AuthContext";
import { Navigate } from "react-router-dom";

const CompanyProtectedRoute = ({ children }) => {
  const { company, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!company) {
    return <Navigate to="/company/login" />;
  }

  return children;
};

export default CompanyProtectedRoute;
