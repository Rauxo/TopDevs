import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../API/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/" replace state={{ requireAuth: "user-login" }} />;
  }

  return children;
};
export default ProtectedRoute;