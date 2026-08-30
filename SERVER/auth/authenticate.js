const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { requireAuth } = require("./middleWare");
const { logActivity } = require("../utils/activityLogger");

// Public owner registration has been removed on purpose: this system is
// designed for exactly one owner account, and that account is created once,
// up front, via `npm run seed` (see SERVER/seed.js). Storekeepers are never
// self-registered either; they're created by the owner via /storekeepers.

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required!" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).send({ error: "Your account has been deactivated. Please contact the owner." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    req.session.user = {
      id: user._id.toString(),
      names: user.fullnames,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };

    await logActivity(
      user.email,
      "LOGIN",
      `${user.fullnames} logged in`,
      user.role === "storekeeper" ? user._id : null
    );

    res.status(200).send({ message: "User logged in successfully", user: req.session.user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.status(500).send({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.status(200).send({ message: "Logout success!" });
  });
});

router.get("/dashboard", requireAuth, (req, res) => {
  res.status(200).send({ user: req.session.user });
});

// Change password - used both for the forced first-time change (temp
// password from an owner) and any later voluntary password change.
router.put("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).send({ error: "Current and new password are required!" });
    }
    if (newPassword.length < 6) {
      return res.status(400).send({ error: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.session.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).send({ error: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.mustChangePassword = false;
    await user.save();

    req.session.user.mustChangePassword = false;

    await logActivity(
      user.email,
      "CHANGE_PASSWORD",
      `${user.fullnames} changed their password`,
      user.role === "storekeeper" ? user._id : null
    );

    res.status(200).send({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
