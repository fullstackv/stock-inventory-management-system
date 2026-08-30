const router = require("express").Router();
const mongoose = require("mongoose");
const Spare = require("./models/Spare");
const StockIn = require("./models/StockIn");
const StockOut = require("./models/StockOut");
const StockAdjustment = require("./models/StockAdjustment");
const { requireAuth, requireRole, blockIfMustChangePassword } = require("./auth/middleWare");

router.use(requireAuth, requireRole("storekeeper"), blockIfMustChangePassword);

// GET /reports - supports several report "type" values:
//   stockin | stockout | both   -> movement reports
//   valuation                   -> current stock valuation snapshot
//   lowstock                    -> items at/below reorder level
//   adjustments                 -> stock adjustment history
router.get("/reports", async (req, res) => {
  try {
    const storeKeeper = new mongoose.Types.ObjectId(req.session.user.id);
    const { type, startDate, endDate, category_id, supplier_id } = req.query;

    // ---------- Valuation report ----------
    if (type === "valuation") {
      const match = { storeKeeper };
      if (category_id) match.category = new mongoose.Types.ObjectId(category_id);
      if (supplier_id) match.supplier = new mongoose.Types.ObjectId(supplier_id);

      const rows = await Spare.aggregate([
        { $match: match },
        { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "categoryDoc" } },
        { $lookup: { from: "suppliers", localField: "supplier", foreignField: "_id", as: "supplierDoc" } },
        { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$supplierDoc", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            name: 1,
            sku: 1,
            quantity: 1,
            unitPrice: 1,
            totalPrice: 1,
            category: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
            supplier: { $ifNull: ["$supplierDoc.name", "-"] },
          },
        },
        { $sort: { totalPrice: -1 } },
      ]);
      return res.json(rows);
    }

    // ---------- Low stock report ----------
    if (type === "lowstock") {
      const rows = await Spare.aggregate([
        { $match: { storeKeeper, $expr: { $lte: ["$quantity", "$minStockLevel"] } } },
        { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "categoryDoc" } },
        { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            name: 1,
            sku: 1,
            quantity: 1,
            min_stock_level: "$minStockLevel",
            category: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
          },
        },
        { $sort: { quantity: 1 } },
      ]);
      return res.json(rows);
    }

    // ---------- Stock adjustment history report ----------
    if (type === "adjustments") {
      const rows = await StockAdjustment.aggregate([
        { $match: { storeKeeper } },
        { $sort: { createdAt: -1 } },
        { $limit: 500 },
        { $lookup: { from: "spares", localField: "spare", foreignField: "_id", as: "spareDoc" } },
        { $unwind: { path: "$spareDoc", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            date: "$createdAt",
            name: { $ifNull: ["$spareDoc.name", "(deleted spare)"] },
            sku: { $ifNull: ["$spareDoc.sku", "-"] },
            adjustment_type: "$adjustmentType",
            quantity: 1,
            reason: 1,
            adjusted_by: "$adjustedBy",
          },
        },
      ]);
      return res.json(rows);
    }

    // ---------- Stock movement reports (in / out / both) ----------
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const spareMatch = {};
    if (category_id) spareMatch["spareDoc.category"] = new mongoose.Types.ObjectId(category_id);
    if (supplier_id) spareMatch["spareDoc.supplier"] = new mongoose.Types.ObjectId(supplier_id);

    const buildMovementPipeline = (label) => [
      { $match: { storeKeeper, ...dateFilter } },
      { $lookup: { from: "spares", localField: "spare", foreignField: "_id", as: "spareDoc" } },
      { $unwind: "$spareDoc" },
      ...(Object.keys(spareMatch).length ? [{ $match: spareMatch }] : []),
      {
        $project: {
          _id: 0,
          type: label,
          name: "$spareDoc.name",
          sku: "$spareDoc.sku",
          quantity: 1,
          date: 1,
        },
      },
    ];

    let rows = [];
    if (type === "stockin") {
      rows = await StockIn.aggregate(buildMovementPipeline("IN"));
    } else if (type === "stockout") {
      rows = await StockOut.aggregate(buildMovementPipeline("OUT"));
    } else {
      const [inRows, outRows] = await Promise.all([
        StockIn.aggregate(buildMovementPipeline("IN")),
        StockOut.aggregate(buildMovementPipeline("OUT")),
      ]);
      rows = [...inRows, ...outRows];
    }

    rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;
