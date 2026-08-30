const mongoose = require("mongoose");

const stockOutSchema = new mongoose.Schema(
  {
    spare: { type: mongoose.Schema.Types.ObjectId, ref: "Spare", required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    date: { type: Date, required: true },
    storeKeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockOut", stockOutSchema);
