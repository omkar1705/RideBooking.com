// src/utils/helpers.js
exports.formatError = (error) => {
  return {
    message: error.message,
    code: error.code,
    details: process.env.NODE_ENV === "development" ? error.details : undefined,
  };
};

exports.validateRideStatus = (currentStatus, newStatus, userRole) => {
  const validTransitions = {
    passenger: {
      pending: ["cancelled"],
    },
    driver: {
      pending: ["accepted"],
      accepted: ["completed"],
    },
  };

  return (
    validTransitions[userRole]?.[currentStatus]?.includes(newStatus) || false
  );
};
