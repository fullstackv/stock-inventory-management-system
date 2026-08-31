const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Category = require("./models/Category");
const Supplier = require("./models/Supplier");
const Spare = require("./models/Spare");
const StockIn = require("./models/StockIn");
const StockOut = require("./models/StockOut");
const StockAdjustment = require("./models/StockAdjustment");
const ActivityLog = require("./models/ActivityLog");
const { requireAuth, requireRole } = require("./auth/middleWare");
const { logActivity } = require("./utils/activityLogger");
const { generateTempPassword } = require("./utils/passwordGenerator");

// All routes here are owner-only.
//
// IMPORTANT: this must be scoped to the "/storekeepers" path prefix, NOT a
// bare router.use(requireAuth, requireRole("owner")). server.js mounts every
// domain router at "/" (e.g. app.use(storekeepersRouter)), and this router is
// mounted before spares/categories/suppliers/etc. An un-scoped router.use()
// runs for EVERY request that reaches this router - including ones meant for
// routes defined in totally different files, like GET /spares - because
// Express dispatches middleware before it knows whether a later route will
// match. That was the root cause of storekeepers getting "You don't have
// permission to perform this action" on every single sidebar page: their
// requests were being rejected here, by the owner-only gate, before they
// ever reached spares.js/categories.js/etc.
router.use("/storekeepers", requireAuth, requireRole("owner"));

// GET all storekeepers this owner has created
router.get("/storekeepers", async (req, res) => {
  try {
    const storekeepers = await User.find({
      role: "storekeeper",
      createdBy: req.session.user.id,
    })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(storekeepers);
  } catch (error) {
    console.error("Fetch storekeepers error:", error);
    res.status(500).json({ error: "Failed to fetch storekeepers" });
  }
});

// GET /storekeepers/overview - stats for the owner's dashboard. Owners
// never see inventory data (that's each storekeeper's own, isolated
// domain) - this is scoped entirely to the accounts the owner manages:
// how many storekeepers they have, their status breakdown, a 6-month
// growth trend, and a recent activity feed of owner-level actions
// (creating/updating/deactivating/deleting storekeepers, resetting
// passwords, logins, etc).
router.get("/storekeepers/overview", async (req, res) => {
  try {
    const ownerId = req.session.user.id;
    const now = new Date();

    const [all, recentActivityRaw] = await Promise.all([
      User.find({ role: "storekeeper", createdBy: ownerId })
        .select("fullnames email isActive mustChangePassword createdAt")
        .sort({ createdAt: -1 }),
      // Owner-level log entries are written with storeKeeper: null, and
      // logActivity is always called with the currently signed-in owner's
      // email, so filtering by that email keeps this scoped to just this
      // owner (relevant now, and if multi-owner support is ever added later).
      ActivityLog.find({ storeKeeper: null, userEmail: req.session.user.email })
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalStorekeepers = all.length;
    const activeCount = all.filter((s) => s.isActive).length;
    const inactiveCount = totalStorekeepers - activeCount;
    const pendingSetupCount = all.filter((s) => s.mustChangePassword).length;
    // Non-overlapping breakdown for the status pie chart: every storekeeper
    // falls into exactly one bucket (inactive wins over pending-setup if
    // somehow both are true, e.g. deactivated before ever logging in).
    const settledActiveCount = all.filter((s) => s.isActive && !s.mustChangePassword).length;
    const pendingActiveCount = all.filter((s) => s.isActive && s.mustChangePassword).length;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = all.filter((s) => s.createdAt >= startOfMonth).length;

    // 6-month growth trend: storekeepers created per month.
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      const count = all.filter((s) => s.createdAt >= d && s.createdAt < nextD).length;
      months.push({ month: label, added: count });
    }

    res.status(200).json({
      summary: {
        totalStorekeepers,
        activeCount,
        inactiveCount,
        pendingSetupCount,
        newThisMonth,
      },
      statusBreakdown: {
        settledActive: settledActiveCount,
        pendingActive: pendingActiveCount,
        inactive: inactiveCount,
      },
      growthTrend: months,
      recentStorekeepers: all.slice(0, 5).map((s) => ({
        id: s._id,
        fullnames: s.fullnames,
        email: s.email,
        isActive: s.isActive,
        mustChangePassword: s.mustChangePassword,
        createdAt: s.createdAt,
      })),
      recentActivity: recentActivityRaw.map((a) => ({
        action: a.action,
        details: a.details,
        created_at: a.createdAt,
      })),
    });
  } catch (error) {
    console.error("Fetch owner overview error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard overview" });
  }
});

// CREATE a new storekeeper with a shared default temporary password
router.post("/storekeepers", async (req, res) => {
  const { fullnames, email, phone } = req.body;
  try {
    if (!fullnames || !email) {
      return res.status(400).json({ error: "Full names and email are required!" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    const storekeeper = await User.create({
      fullnames,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role: "storekeeper",
      createdBy: req.session.user.id,
      isActive: true,
      mustChangePassword: true,
    });

    await logActivity(req.session.user.email, "CREATE_STOREKEEPER", `Added storekeeper "${fullnames}"`);

    res.status(201).json({
      message: "Storekeeper created successfully!",
      storekeeper: {
        id: storekeeper._id,
        fullnames: storekeeper.fullnames,
        email: storekeeper.email,
      },
      // Only ever returned once - share it with the storekeeper securely.
      // It is not retrievable again after this response.
      tempPassword,
    });
  } catch (error) {
    console.error("Create storekeeper error:", error);
    res.status(500).json({ error: "Failed to create storekeeper" });
  }
});

// UPDATE storekeeper profile info
router.put("/storekeepers/:id", async (req, res) => {
  const { fullnames, email, phone } = req.body;
  try {
    const storekeeper = await User.findOne({
      _id: req.params.id,
      role: "storekeeper",
      createdBy: req.session.user.id,
    });
    if (!storekeeper) return res.status(404).json({ error: "Storekeeper not found" });

    if (!fullnames || !email) {
      return res.status(400).json({ error: "Full names and email are required!" });
    }

    storekeeper.fullnames = fullnames;
    storekeeper.email = email.toLowerCase();
    storekeeper.phone = phone;
    await storekeeper.save();

    await logActivity(req.session.user.email, "UPDATE_STOREKEEPER", `Updated storekeeper "${fullnames}"`);
    res.status(200).json({ message: "Storekeeper updated successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    console.error("Update storekeeper error:", error);
    res.status(500).json({ error: "Failed to update storekeeper" });
  }
});

// ACTIVATE / DEACTIVATE - deactivating immediately blocks further login
// AND terminates any session that storekeeper currently holds, because
// requireAuth re-checks isActive against the DB on every single request.
router.patch("/storekeepers/:id/status", async (req, res) => {
  const { isActive } = req.body;
  try {
    const storekeeper = await User.findOne({
      _id: req.params.id,
      role: "storekeeper",
      createdBy: req.session.user.id,
    });
    if (!storekeeper) return res.status(404).json({ error: "Storekeeper not found" });

    storekeeper.isActive = Boolean(isActive);
    await storekeeper.save();

    await logActivity(
      req.session.user.email,
      isActive ? "ACTIVATE_STOREKEEPER" : "DEACTIVATE_STOREKEEPER",
      `${isActive ? "Activated" : "Deactivated"} storekeeper "${storekeeper.fullnames}"`
    );

    res.status(200).json({
      message: `Storekeeper ${isActive ? "activated" : "deactivated"} successfully!`,
    });
  } catch (error) {
    console.error("Update storekeeper status error:", error);
    res.status(500).json({ error: "Failed to update storekeeper status" });
  }
});

// RESET PASSWORD - owner can issue a fresh temp password if a storekeeper
// is locked out or forgets theirs.
router.post("/storekeepers/:id/reset-password", async (req, res) => {
  try {
    const storekeeper = await User.findOne({
      _id: req.params.id,
      role: "storekeeper",
      createdBy: req.session.user.id,
    });
    if (!storekeeper) return res.status(404).json({ error: "Storekeeper not found" });

    const tempPassword = generateTempPassword();
    storekeeper.password = await bcrypt.hash(tempPassword, 10);
    storekeeper.mustChangePassword = true;
    await storekeeper.save();

    await logActivity(req.session.user.email, "RESET_STOREKEEPER_PASSWORD", `Reset password for "${storekeeper.fullnames}"`);

    res.status(200).json({ message: "Password reset successfully!", tempPassword });
  } catch (error) {
    console.error("Reset storekeeper password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// DELETE - permanently removes the storekeeper AND cascades their
// inventory data, since it's meaningless without an owning account.
router.delete("/storekeepers/:id", async (req, res) => {
  try {
    const storekeeper = await User.findOne({
      _id: req.params.id,
      role: "storekeeper",
      createdBy: req.session.user.id,
    });
    if (!storekeeper) return res.status(404).json({ error: "Storekeeper not found" });

    const scopeFilter = { storeKeeper: storekeeper._id };
    await Promise.all([
      Spare.deleteMany(scopeFilter),
      Category.deleteMany(scopeFilter),
      Supplier.deleteMany(scopeFilter),
      StockIn.deleteMany(scopeFilter),
      StockOut.deleteMany(scopeFilter),
      StockAdjustment.deleteMany(scopeFilter),
      ActivityLog.deleteMany(scopeFilter),
      storekeeper.deleteOne(),
    ]);

    await logActivity(req.session.user.email, "DELETE_STOREKEEPER", `Deleted storekeeper "${storekeeper.fullnames}" and all their data`);

    res.status(200).json({ message: "Storekeeper deleted successfully!" });
  } catch (error) {
    console.error("Delete storekeeper error:", error);
    res.status(500).json({ error: "Failed to delete storekeeper" });
  }
});

module.exports = router;
