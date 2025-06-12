// src/controllers/rideController.js
const supabase = require("../config/database");
const { RIDE_STATUS } = require("../config/constants");

exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, transport_type, price_per_km } = req.body;
    const passenger_id = req.user.id;

    if (!pickup || !destination || !transport_type || !price_per_km) {
      console.log("Validation failed:", {
        pickup,
        destination,
        transport_type,
        price_per_km,
      });
      return res.status(400).json({
        error: "Missing required fields",
        required: ["pickup", "destination", "transport_type", "price_per_km"],
        received: { pickup, destination, transport_type, price_per_km },
      });
    }

    // Validate transport type
    const validTransportTypes = ["car", "bike", "electric_bike", "bus"];
    if (!validTransportTypes.includes(transport_type)) {
      return res.status(400).json({
        error: "Invalid transport type",
        validTypes: validTransportTypes,
        received: transport_type,
      });
    }

    // Validate price
    if (typeof price_per_km !== "number" || price_per_km <= 0) {
      return res.status(400).json({
        error: "Invalid price",
        received: price_per_km,
      });
    }

    // Create the ride
    const { data, error } = await supabase
      .from("rides")
      .insert([
        {
          passenger_id,
          pickup,
          destination,
          transport_type,
          price_per_km,
          status: "pending",
          inserted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({
        error: "Failed to create ride",
        details: error.message,
      });
    }

    console.log("Ride created:", data); // Debug log
    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.getPassengerRides = async (req, res) => {
  try {
    console.log("Fetching rides for passenger:", req.user.id); // Debug log

    const { data, error } = await supabase
      .from("rides")
      .select(
        `
        *,
        driver:users_profile!rides_driver_id_fkey (
          full_name,
          phone
        )
      `
      )
      .eq("passenger_id", req.user.id)
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error); // Debug log
      return res.status(400).json({ error: error.message });
    }

    console.log("Rides fetched:", data); // Debug log
    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error); // Debug log
    res.status(500).json({
      error: "Failed to fetch rides",
      details: error.message,
    });
  }
};

exports.getDriverRides = async (req, res) => {
  try {
    console.log("Fetching rides for driver:", req.user.id);
    const { data, error } = await supabase
      .from("rides")
      .select(
        `
        *,
        passenger:users_profile(
          full_name,
          phone
        )
      `
      )
      .eq("status", "pending")
      .is("driver_id", null);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Available rides:", data);
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching driver rides:", error);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
};

exports.getMyRides = async (req, res) => {
  try {
    console.log("Fetching ongoing rides for driver:", req.user.id);
    const { data, error } = await supabase
      .from("rides")
      .select(
        `
        *,
        passenger:users_profile(
          full_name,
          phone
        )
      `
      )
      .eq("driver_id", req.user.id)
      .in("status", ["accepted", "ongoing"]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Ongoing rides:", data);
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching ongoing rides:", error);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({
        driver_id: driverId,
        status: "accepted",
      })
      .eq("id", rideId)
      .eq("status", "pending")
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Error accepting ride:", error);
    res.status(500).json({ error: "Failed to accept ride" });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({ status: "completed" })
      .eq("id", rideId)
      .eq("driver_id", driverId)
      .eq("status", "accepted")
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Error completing ride:", error);
    res.status(500).json({ error: "Failed to complete ride" });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const passenger_id = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({ status: "cancelled" }) // Use string instead of RIDE_STATUS.CANCELLED
      .eq("id", rideId)
      .eq("passenger_id", passenger_id)
      .eq("status", "pending") // Use string instead of RIDE_STATUS.PENDING
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Error cancelling ride:", error);
    res.status(500).json({ error: "Failed to cancel ride" });
  }
};
