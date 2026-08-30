const mongoose = require("mongoose");

const spareSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", default: null },
    quantity: { type: Number, required: true, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    location: { type: String, default: null },
    storeKeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

// SKUs only need to be unique within one storekeeper's own inventory.
spareSchema.index({ storeKeeper: 1, sku: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Spare", spareSchema);
