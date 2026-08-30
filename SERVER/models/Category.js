const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    // Every inventory record is scoped to the storekeeper who owns it, so
    // one storekeeper's data is never visible to another.
    storeKeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

categorySchema.index({ storeKeeper: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
