const router = require("express").Router();
const Spare = require("./models/Spare");
const StockAdjustment = require("./models/StockAdjustment");
const { logActivity } = require("./utils/activityLogger");

const { requireAuth, requireRole } = require("./auth/middleWare");

router.use(requireAuth, requireRole("storekeeper"));

// GET ADJUSTMENT HISTORY
router.get("/adjustments", async (req, res) => {
  try {
    const adjustments = await StockAdjustment.find({ storeKeeper: req.session.user.id })
      .populate("spare", "name sku")
      .sort({ createdAt: -1 })
      .limit(200);

    const shaped = adjustments.map((a) => ({
      id: a._id,
      adjustment_type: a.adjustmentType,
      quantity: a.quantity,
      reason: a.reason,
      adjusted_by: a.adjustedBy,
      created_at: a.createdAt,
      spareName: a.spare?.name || "(deleted spare)",
      sku: a.spare?.sku || "-",
    }));

    res.status(200).json(shaped);
  } catch (error) {
    console.error("Fetch adjustments error:", error);
    res.status(500).json({ error: "Failed to fetch stock adjustments" });
  }
});

// CREATE ADJUSTMENT
router.post("/adjustments", async (req, res) => {
  const { spare_id, adjustment_type, quantity, reason } = req.body;
  try {
    if (!spare_id || !adjustment_type || !quantity || !reason) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    if (!["increase", "decrease"].includes(adjustment_type)) {
      return res.status(400).json({ error: "Adjustment type must be increase or decrease" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const spare = await Spare.findOne({ _id: spare_id, storeKeeper: req.session.user.id });
    if (!spare) return res.status(404).json({ error: "Spare not found" });
    if (adjustment_type === "decrease" && spare.quantity < quantity) {
      return res.status(400).json({ error: "Cannot decrease below zero - insufficient stock" });
    }

    await StockAdjustment.create({
      spare: spare_id,
      adjustmentType: adjustment_type,
      quantity,
      reason,
      adjustedBy: req.session.user.names || "Unknown",
      storeKeeper: req.session.user.id,
    });

    spare.quantity += adjustment_type === "increase" ? Number(quantity) : -Number(quantity);
    spare.totalPrice = spare.quantity * spare.unitPrice;
    await spare.save();

    await logActivity(
      req.session.user.email,
      "STOCK_ADJUSTMENT",
      `${adjustment_type === "increase" ? "Increased" : "Decreased"} "${spare.name}" by ${quantity} (${reason})`,
      req.session.user.id
    );

    res.status(201).json({ message: "Stock adjustment recorded successfully!" });
  } catch (error) {
    console.error("Create adjustment error:", error);
    res.status(500).json({ error: "Failed to record stock adjustment" });
  }
});

module.exports = router;
