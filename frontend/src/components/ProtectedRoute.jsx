// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const { user } = useAuth();

  // If no user is logged in, redirect to home page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to home
  if (allowedRole && user.user_metadata?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
