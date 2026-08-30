const mongoose = require("mongoose");

const stockInSchema = new mongoose.Schema(
  {
    spare: { type: mongoose.Schema.Types.ObjectId, ref: "Spare", required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, required: true },
    storeKeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockIn", stockInSchema);
