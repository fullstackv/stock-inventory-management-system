const mongoose = require("mongoose");

const stockAdjustmentSchema = new mongoose.Schema(
  {
    spare: { type: mongoose.Schema.Types.ObjectId, ref: "Spare", required: true },
    adjustmentType: { type: String, enum: ["increase", "decrease"], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    adjustedBy: { type: String, default: "Unknown" },
    storeKeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockAdjustment", stockAdjustmentSchema);
