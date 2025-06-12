// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Define routes
router.post("/register", (req, res, next) =>
  authController.register(req, res, next)
);
router.post("/login", (req, res, next) => authController.login(req, res, next));
// Remove auth middleware for logout since we're handling it on frontend
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
