// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://ride-booking-com-akok-git-main-omkar1705s-projects.vercel.app/api",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ride Booking API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
