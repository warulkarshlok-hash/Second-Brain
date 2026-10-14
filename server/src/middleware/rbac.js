/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces admin authorization for protected administration endpoints.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required before checking roles',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin privileges are required to access this resource',
      currentRole: req.user.role,
    });
  }

  next();
};
