// src/routes/rideRoutes.js
const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideController");
const auth = require("../middleware/auth");
const { checkRole } = require("../middleware/checkRole");

const debugMiddleware = (req, res, next) => {
  console.log("Request path:", req.path);
  console.log("User:", req.user);
  next();
};
router.use(debugMiddleware);
// Passenger routes
router.get("/passenger/rides", auth, rideController.getPassengerRides);
router.post("/create", auth, rideController.createRide);

router.post(
  "/cancel/:rideId",
  auth,
  (req, res, next) => checkRole("passenger")(req, res, next),
  (req, res, next) => rideController.cancelRide(req, res, next)
);

// Driver routes
router.get(
  "/driver/rides",
  auth,
  (req, res, next) => checkRole("driver")(req, res, next),
  (req, res, next) => rideController.getDriverRides(req, res, next)
);

router.post(
  "/accept/:rideId",
  auth,
  (req, res, next) => checkRole("driver")(req, res, next),
  (req, res, next) => rideController.acceptRide(req, res, next)
);

router.post(
  "/complete/:rideId",
  auth,
  (req, res, next) => checkRole("driver")(req, res, next),
  (req, res, next) => rideController.completeRide(req, res, next)
);

router.get(
  "/driver/my-rides",
  auth,
  checkRole("driver"),
  rideController.getMyRides
);

module.exports = router;
