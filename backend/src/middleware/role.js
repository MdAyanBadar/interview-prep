// ✅ Role Middleware - Checks if user has required role
/**
 * Role-based access control middleware
 * @param {string} role - allowed role (e.g. "admin")
 */
const role = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions"
      });
    }
    next();
  };
};

module.exports = role;
