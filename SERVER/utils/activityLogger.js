const ActivityLog = require("../models/ActivityLog");

/**
 * Records an entry in the activity log for the audit trail.
 * `storeKeeperId` scopes the entry so each storekeeper only ever sees
 * their own activity feed. Pass null for owner-level actions.
 * Never throws - logging failures must not break the main request.
 */
const logActivity = async (userEmail, action, details = null, storeKeeperId = null) => {
  try {
    await ActivityLog.create({
      userEmail: userEmail || "system",
      action,
      details,
      storeKeeper: storeKeeperId,
    });
  } catch (error) {
    console.error("Activity log failed:", error.message);
  }
};

module.exports = { logActivity };
