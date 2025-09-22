// src/utils/authErrorHandler.js
import { useNavigate } from "react-router-dom";

export const handleAuthError = (error, navigate) => {
  // Check if it's an authentication error
  if (error.message && error.message.includes("Authentication required")) {
    // Redirect to home page for authentication errors
    navigate("/", { replace: true });
    return true; // Indicates that the error was handled
  }
  return false; // Indicates that the error was not an auth error
};
