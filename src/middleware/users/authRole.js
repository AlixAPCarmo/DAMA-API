//function to manage user roles
/**
 * ADMIN
 * CEO
 * DIRECTOR
 * MANAGER
 * EMPLOYEE
 */

export function authRole(roles) {
  // Ensure roles is always an array
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        data: [],
        error: "You don't have authorization to view this page.",
        status: 401,
      });
    }

    // Check if the user has one of the required roles
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        ok: false,
        data: [],
        error: "You are not authorized to view this page.",
        status: 401,
      });
    }

    // User is authenticated and has a required role
    next();
  };
}
