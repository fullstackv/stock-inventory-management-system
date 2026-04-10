import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // For now, simulate auth (later connect to backend)
  const isAuthenticated = localStorage.getItem("user");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;