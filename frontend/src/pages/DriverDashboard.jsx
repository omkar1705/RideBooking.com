// src/pages/DriverDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { handleAuthError } from "../utils/authErrorHandler";
import Header from "../components/Header";
import { rides } from "../services/api";
import bikeIcon from "../assets/images/bike.png";
import carIcon from "../assets/images/car.png";
import electricBikeIcon from "../assets/images/electric-bike.png";
import busIcon from "../assets/images/bus.png";

export default function DriverDashboard() {
  const navigate = useNavigate();
  // Use authentication guard to ensure user is logged in and has driver role
  const { user, isAuthenticated } = useAuthGuard("driver");
  
  const [availableRides, setAvailableRides] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch rides if user is authenticated
    if (isAuthenticated) {
      fetchRides();
    }
  }, [isAuthenticated]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both available and ongoing rides
      const [availableRides, myRides] = await Promise.all([
        rides.getDriverRides(),
        rides.getMyRides(),
      ]);

      setAvailableRides(availableRides || []);
      setMyRides(myRides || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
      
      // Handle authentication errors
      if (handleAuthError(error, navigate)) {
        return;
      }
      
      setError("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      await rides.acceptRide(rideId);
      fetchRides(); // Refresh rides after accepting
      setError(null);
    } catch (error) {
      console.error("Error accepting ride:", error);
      
      // Handle authentication errors
      if (handleAuthError(error, navigate)) {
        return;
      }
      
      setError("Failed to accept ride");
    }
  };

  const handleCompleteRide = async (rideId) => {
    try {
      await rides.completeRide(rideId);
      fetchRides(); // Refresh rides after completing
      setError(null);
    } catch (error) {
      console.error("Error completing ride:", error);
      
      // Handle authentication errors
      if (handleAuthError(error, navigate)) {
        return;
      }
      
      setError("Failed to complete ride");
    }
  };

  const RideCard = ({ ride, onAccept, onComplete }) => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">
              {ride.transport_type === "car" ? (
                <img src={carIcon} alt="Car" className="w-8 h-8" />
              ) : ride.transport_type === "bike" ? (
                <img src={bikeIcon} alt="Bike" className="w-8 h-8" />
              ) : ride.transport_type === "electric_bike" ? (
                <img
                  src={electricBikeIcon}
                  alt="Electric Bike"
                  className="w-8 h-8"
                />
              ) : (
                <img src={busIcon} alt="Bus" className="w-8 h-8" />
              )}
            </span>
            <p className="font-medium">
              {ride.pickup} → {ride.destination}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(ride.inserted_at).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">₹{ride.price_per_km}/km</p>
          {ride.passenger && (
            <p className="text-sm text-gray-600 mt-2">
              Passenger: {ride.passenger.full_name}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              ride.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : ride.status === "accepted"
                ? "bg-blue-100 text-blue-800"
                : ride.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
          </span>
          {ride.status === "pending" && onAccept && (
            <button
              onClick={() => onAccept(ride.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Accept Ride
            </button>
          )}
          {ride.status === "accepted" && onComplete && (
            <button
              onClick={() => onComplete(ride.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Complete Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Show loading while authentication is being verified */}
      {!isAuthenticated ? (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Verifying authentication...</div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Driver Dashboard
          </h1>
          <button
            onClick={fetchRides}
            className="text-blue-500 hover:text-blue-600"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Rides */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Available Rides
            </h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : availableRides.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No available rides
              </div>
            ) : (
              <div className="space-y-4">
                {availableRides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    onAccept={handleAcceptRide}
                  />
                ))}
              </div>
            )}
          </div>

          {/* My Ongoing Rides */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              My Ongoing Rides
            </h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : myRides.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No ongoing rides
              </div>
            ) : (
              <div className="space-y-4">
                {myRides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    onComplete={handleCompleteRide}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
