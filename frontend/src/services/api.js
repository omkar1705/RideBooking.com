// src/services/api.js
import axios from "axios";

const API_URL = "https://ridebooking-com.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error);
    return Promise.reject(error);
  }
);

export const auth = {
  register: async (userData) => {
    try {
      console.log("Sending registration data:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error details:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = localStorage.getItem("user");
    const session = localStorage.getItem("session");
    return !!(user && session);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, session } = response.data;

      // Store both user and session data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(session));

      return { user, session };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
  },
};

export const rides = {
  // Helper function to check authentication before ride operations
  _checkAuth: () => {
    if (!auth.isAuthenticated()) {
      throw new Error("Authentication required. Please log in to perform this action.");
    }
  },

  // For drivers
  getDriverRides: async () => {
    try {
      rides._checkAuth();
      const response = await api.get("/rides/driver/rides");
      return response.data; // Return just the data
    } catch (error) {
      console.error("Error fetching driver rides:", error);
      throw error;
    }
  },

  getMyRides: async () => {
    try {
      rides._checkAuth();
      const response = await api.get("/rides/driver/my-rides");
      return response.data; // Return just the data
    } catch (error) {
      console.error("Error fetching my rides:", error);
      throw error;
    }
  },

  acceptRide: async (rideId) => {
    try {
      rides._checkAuth();
      const response = await api.post(`/rides/accept/${rideId}`);
      return response;
    } catch (error) {
      console.error("Error accepting ride:", error);
      throw error;
    }
  },

  completeRide: async (rideId) => {
    try {
      rides._checkAuth();
      const response = await api.post(`/rides/complete/${rideId}`);
      return response;
    } catch (error) {
      console.error("Error completing ride:", error);
      throw error;
    }
  },

  createRide: async (rideData) => {
    try {
      rides._checkAuth();
      const response = await api.post("/rides/create", rideData);
      return response.data;
    } catch (error) {
      console.error("Error creating ride:", error);
      throw error;
    }
  },

  // Add cancelRide function
  cancelRide: async (rideId) => {
    try {
      rides._checkAuth();
      const response = await api.post(`/rides/cancel/${rideId}`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling ride:", error);
      throw error;
    }
  },

  // Update getPassengerRides function
  getPassengerRides: async () => {
    try {
      rides._checkAuth();
      const response = await api.get("/rides/passenger/rides");
      return response.data;
    } catch (error) {
      console.error("Error fetching passenger rides:", error);
      throw error;
    }
  },
};

export default api;
