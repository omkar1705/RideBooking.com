import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout(); // Use AuthContext logout function
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getDashboardTitle = () => {
    if (location.pathname.includes("/passenger")) {
      return "Passenger Dashboard";
    } else if (location.pathname.includes("/driver")) {
      return "Driver Dashboard";
    }
    return "";
  };

  return (
    <nav className="bg-white shadow-lg h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-3xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
          >
            Ride Booking
            <span className="text-yellow-500">.com</span>
          </h1>
        </div>

        {/* Center: Dashboard Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {getDashboardTitle() && (
            <span className="text-2xl font-medium text-gray-600">
              {getDashboardTitle()}
            </span>
          )}
        </div>

        {/* Right: User Info & Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex flex-col items-end text-right">
                <span className="text-base font-semibold text-gray-900">
                  {user.user_metadata?.full_name || "User"}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="capitalize">
                    {user.user_metadata?.role || "User"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{user.user_metadata?.phone || "No phone"}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border-2 border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors duration-300"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors duration-300"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
