// src/pages/PassengerDashboard.jsx
import { useState, useEffect } from "react";
import { rides } from "../services/api";
import Header from "../components/Header";
import TransportSelection from "../components/TransportSelection";
import bikeIcon from "../assets/images/bike.png";
import carIcon from "../assets/images/car.png";
import electricBikeIcon from "../assets/images/electric-bike.png";
import busIcon from "../assets/images/bus.png";

export default function PassengerDashboard() {
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
  });

  const fetchRides = async () => {
    try {
      setLoading(true);
      const data = await rides.getPassengerRides();
      setMyRides(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching rides:", error);
      setError("Failed to fetch rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTransport) {
      setError("Please select a transport type");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Log the data being sent
      const rideData = {
        pickup: formData.pickup,
        destination: formData.destination,
        transport_type: selectedTransport.id,
        price_per_km: Number(selectedTransport.pricePerKm), // Ensure it's a number
      };

      console.log("Submitting ride data:", rideData); // Debug log

      await rides.createRide(rideData);

      // Clear form and refresh rides
      setFormData({ pickup: "", destination: "" });
      setSelectedTransport(null);
      fetchRides();
    } catch (error) {
      console.error("Error creating ride:", error);
      setError(error.response?.data?.error || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rideId) => {
    try {
      setLoading(true);
      await rides.cancelRide(rideId);
      fetchRides(); // Refresh rides list
      setError(null);
    } catch (error) {
      console.error("Error cancelling ride:", error);
      setError("Failed to cancel ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">
              Get ready for your trip
            </h2>
            <p className="text-gray-600 mb-6">
              Request a ride now, or schedule one for later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -mt-1 w-2 h-2 bg-black rounded-full" />
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={formData.pickup}
                    onChange={(e) =>
                      setFormData({ ...formData, pickup: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -mt-1 w-2 h-2 bg-black rounded" />
                  <input
                    type="text"
                    placeholder="Enter destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedTransport}
                className={`w-full py-2 rounded-lg ${
                  selectedTransport
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? "Processing..."
                  : selectedTransport
                  ? "Request Ride"
                  : "Select Transport Type"}
              </button>
            </form>
          </div>

          {/* Transport Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Transport Type
            </h2>
            <TransportSelection
              selectedTransport={selectedTransport}
              onSelect={setSelectedTransport}
            />
          </div>
        </div>

        {/* Recent Rides */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Rides</h2>
          {loading ? (
            <div className="text-center py-4">Loading rides...</div>
          ) : myRides.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No rides found</div>
          ) : (
            <div className="space-y-4">
              {myRides.map((ride) => (
                <div key={ride.id} className="bg-white shadow rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {ride.transport_type === "car" ? (
                            <img src={carIcon} alt="Car" className="w-8 h-8" />
                          ) : ride.transport_type === "bike" ? (
                            <img
                              src={bikeIcon}
                              alt="Bike"
                              className="w-8 h-8"
                            />
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
                      <p className="text-sm text-gray-600">
                        ₹{ride.price_per_km}/km
                      </p>

                      {/* Driver Information */}
                      {ride.driver && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-md w-full">
                          <p className="text-sm font-medium text-gray-700">
                            Driver Details:
                          </p>
                          <p className="text-sm text-gray-600">
                            Name: {ride.driver.full_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {ride.driver.phone}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
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
                        {ride.status.charAt(0).toUpperCase() +
                          ride.status.slice(1)}
                      </span>
                      {ride.status === "pending" && (
                        <button
                          onClick={() => handleCancel(ride.id)}
                          className="mt-2 text-lg text-red-600 hover:text-red-900"
                        >
                          Cancel Ride
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
