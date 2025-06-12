// src/middleware/checkRole.js
exports.checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.user_metadata?.role;

    if (!userRole || userRole !== requiredRole) {
      return res.status(403).json({
        error: `Access denied. ${requiredRole} role required.`,
      });
    }

    next();
  };
};
