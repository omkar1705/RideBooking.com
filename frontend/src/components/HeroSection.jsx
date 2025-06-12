// src/components/HeroSection.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import videoBg from "../assets/images/bg-video.mp4";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [buttonText, setButtonText] = useState("Book Now");
  const [userRole, setUserRole] = useState(null);

  // Check user session when component mounts or user changes
  useEffect(() => {
    checkUserSession();
  }, [user]);

  const checkUserSession = () => {
    try {
      if (user) {
        const role = user.user_metadata?.role;
        setUserRole(role);

        // Set button text based on role
        if (role === "passenger") {
          setButtonText("Book Now");
        } else if (role === "driver") {
          setButtonText("Get Passengers");
        }
      } else {
        setButtonText("Book Now"); // Not logged in
        setUserRole(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setButtonText("Book Now"); // Default fallback
    }
  };

  const handleButtonClick = () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      // Navigate based on role
      if (userRole === "passenger") {
        navigate("/passenger");
      } else if (userRole === "driver") {
        navigate("/driver");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      navigate("/login");
    }
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline // Add playsinline for better mobile support
        className="absolute w-full h-full object-cover z-0"
        src={videoBg}
      />

      {/* Overlay with Text */}
      <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
        <h2 className="text-white text-3xl md:text-5xl font-semibold text-center px-4">
          {userRole === "driver"
            ? "Find Your Next Passenger"
            : "Get Your Ride Instantly"}
        </h2>
      </div>

      {/* Call to Action Button */}
      <div className="absolute inset-0 z-20 flex items-center justify-center mt-30">
        <button
          onClick={handleButtonClick}
          className={`px-6 py-3 ${
            userRole === "driver"
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-white rounded-lg shadow-lg transition duration-300 transform hover:scale-105`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
