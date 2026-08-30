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
router.use(requireAuth, requireRole("owner"));

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

// CREATE a new storekeeper with an auto-generated temporary password
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
