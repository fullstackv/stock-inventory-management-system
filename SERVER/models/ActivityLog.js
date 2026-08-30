const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userEmail: { type: String, default: "system" },
    action: { type: String, required: true },
    details: { type: String, default: null },
    // Which storekeeper's data this activity relates to (null for
    // owner-level actions like managing storekeeper accounts), so each
    // storekeeper's dashboard only ever shows their own activity feed.
    storeKeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
