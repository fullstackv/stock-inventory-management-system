const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullnames: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["owner", "storekeeper"], default: "owner", required: true },

    // Only set for storekeepers - which owner account created/manages them.
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Deactivated storekeepers can no longer log in, and any live session
    // they hold is invalidated on their very next request.
    isActive: { type: Boolean, default: true },

    // True right after an owner creates a storekeeper with a temporary
    // password. Forces a password change before the storekeeper can use
    // any other part of the system.
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
