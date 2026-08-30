const User = require("../models/User");

/**
 * Requires a logged-in session AND re-verifies against the database on
 * every request that the account still exists and is still active.
 *
 * This is what makes deactivation immediate: an owner flipping a
 * storekeeper's isActive flag doesn't need to know or touch that
 * storekeeper's live session - the very next request they make will
 * fail this check, and we destroy their session right here.
 */
const requireAuth = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).send({ error: "Access denied, please login!" });
  }

  try {
    const user = await User.findById(req.session.user.id);

    if (!user || !user.isActive) {
      req.session.destroy(() => {});
      return res.status(403).send({
        error: "Your account has been deactivated or no longer exists. Please contact the owner.",
      });
    }

    // Keep the session copy fresh (role/mustChangePassword could have
    // changed since the cookie was issued).
    req.session.user = {
      id: user._id.toString(),
      names: user.fullnames,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };
    req.currentUser = user;
    next();
  } catch (error) {
    console.error("Auth check failed:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Restricts a route to specific roles (e.g. only 'owner').
const requireRole = (...allowedRoles) => (req, res, next) => {
  const role = req.session.user?.role;
  if (!allowedRoles.includes(role)) {
    return res.status(403).send({ error: "You don't have permission to perform this action." });
  }
  next();
};


// No longer wired into any route by default - storekeepers now get full
// access immediately after login with their temporary password.
// Kept here in case a stricter deployment wants to re-enable a forced
// change-on-first-login gate later.
const blockIfMustChangePassword = (req, res, next) => {
  if (req.session.user?.mustChangePassword) {
    return res.status(428).send({ error: "You must change your temporary password before continuing." });
  }
  next();
};

module.exports = { requireAuth, requireRole, blockIfMustChangePassword };