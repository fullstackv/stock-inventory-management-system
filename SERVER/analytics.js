const router = require("express").Router();
const mongoose = require("mongoose");
const Spare = require("./models/Spare");
const Category = require("./models/Category");
const Supplier = require("./models/Supplier");
const StockIn = require("./models/StockIn");
const StockOut = require("./models/StockOut");
const ActivityLog = require("./models/ActivityLog");

const { requireAuth, requireRole } = require("./auth/middleWare");

router.use("/analytics", requireAuth, requireRole("storekeeper"));

router.get("/analytics", async (req, res) => {
  try {
    const storeKeeper = new mongoose.Types.ObjectId(req.session.user.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalSpares,
      totalStockValueAgg,
      lowStockCount,
      totalCategories,
      totalSuppliers,
      stockInThisMonthAgg,
      stockOutThisMonthAgg,
      monthlyInRaw,
      monthlyOutRaw,
      topMovingItems,
      categoryDistribution,
      lowStockItems,
      recentActivity,
    ] = await Promise.all([
      Spare.countDocuments({ storeKeeper }),
      Spare.aggregate([{ $match: { storeKeeper } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
      Spare.countDocuments({ storeKeeper, $expr: { $lte: ["$quantity", "$minStockLevel"] } }),
      Category.countDocuments({ storeKeeper }),
      Supplier.countDocuments({ storeKeeper }),
      StockIn.aggregate([
        { $match: { storeKeeper, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
      StockOut.aggregate([
        { $match: { storeKeeper, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
      StockIn.aggregate([
        { $match: { storeKeeper, date: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, total: { $sum: "$quantity" } } },
      ]),
      StockOut.aggregate([
        { $match: { storeKeeper, date: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, total: { $sum: "$quantity" } } },
      ]),
      StockOut.aggregate([
        { $match: { storeKeeper } },
        { $group: { _id: "$spare", totalOut: { $sum: "$quantity" } } },
        { $sort: { totalOut: -1 } },
        { $limit: 5 },
        { $lookup: { from: "spares", localField: "_id", foreignField: "_id", as: "spare" } },
        { $unwind: "$spare" },
        { $project: { name: "$spare.name", sku: "$spare.sku", totalOut: 1 } },
      ]),
      Spare.aggregate([
        { $match: { storeKeeper } },
        { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "categoryDoc" } },
        { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
            value: { $sum: "$totalPrice" },
          },
        },
        { $match: { value: { $gt: 0 } } },
        { $project: { _id: 0, name: "$_id", value: 1 } },
        { $sort: { value: -1 } },
      ]),
      Spare.find({ storeKeeper, $expr: { $lte: ["$quantity", "$minStockLevel"] } })
        .select("name quantity minStockLevel")
        .limit(8),
      ActivityLog.find({ storeKeeper }).sort({ createdAt: -1 }).limit(10),
    ]);

    // Build a continuous 6-month series, filling any gap months with 0
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short" });
      const inRow = monthlyInRaw.find((r) => r._id === ym);
      const outRow = monthlyOutRaw.find((r) => r._id === ym);
      months.push({
        month: label,
        stockIn: inRow ? inRow.total : 0,
        stockOut: outRow ? outRow.total : 0,
      });
    }

    // Sort the low-stock watchlist by how critical the shortfall is
    const sortedLowStock = [...lowStockItems].sort(
      (a, b) => a.quantity / Math.max(a.minStockLevel, 1) - b.quantity / Math.max(b.minStockLevel, 1)
    );

    res.status(200).json({
      summary: {
        totalSpares,
        totalStockValue: totalStockValueAgg[0]?.total || 0,
        lowStockCount,
        totalCategories,
        totalSuppliers,
        stockInThisMonth: stockInThisMonthAgg[0]?.total || 0,
        stockOutThisMonth: stockOutThisMonthAgg[0]?.total || 0,
      },
      monthlyTrend: months,
      topMovingItems,
      categoryDistribution,
      lowStockItems: sortedLowStock.map((s) => ({
        id: s._id,
        name: s.name,
        quantity: s.quantity,
        min_stock_level: s.minStockLevel,
      })),
      recentActivity: recentActivity.map((a) => ({
        user_email: a.userEmail,
        action: a.action,
        details: a.details,
        created_at: a.createdAt,
      })),
    });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;
