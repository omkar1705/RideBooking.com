// src/hooks/useAuthGuard.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useAuthGuard = (requiredRole = null) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      console.log("No user found, redirecting to home");
      navigate("/", { replace: true });
      return;
    }

    // Check if specific role is required
    if (requiredRole && user.user_metadata?.role !== requiredRole) {
      console.log(`User role ${user.user_metadata?.role} does not match required role ${requiredRole}, redirecting to home`);
      navigate("/", { replace: true });
      return;
    }
  }, [user, requiredRole, navigate]);

  return { user, isAuthenticated: !!user, hasRequiredRole: requiredRole ? user?.user_metadata?.role === requiredRole : true };
};
