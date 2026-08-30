const router = require("express").Router();
const Spare = require("./models/Spare");
const StockOut = require("./models/StockOut");
const { logActivity } = require("./utils/activityLogger");

const { requireAuth, requireRole } = require("./auth/middleWare");

router.use(requireAuth, requireRole("storekeeper"));

// GET all stock-out records for this storekeeper
router.get("/stockout", async (req, res) => {
  try {
    const records = await StockOut.find({ storeKeeper: req.session.user.id })
      .populate("spare", "name sku")
      .sort({ date: -1 });

    const shaped = records.map((r) => ({
      name: r.spare?.name || "(deleted spare)",
      stockOutQuantity: r.quantity,
      stockOutTotalPrice: r.totalPrice,
      stockOutDate: r.date,
    }));

    res.json(shaped);
  } catch (error) {
    console.error("Fetch stock-out error:", error);
    res.status(500).json({ error: "Failed to fetch stock out data" });
  }
});

// REMOVE STOCK (stock out)
router.post("/stockout", async (req, res) => {
  const { spare_id, stockOutQuantity, stockOutDate } = req.body;
  try {
    if (!spare_id || !stockOutQuantity || !stockOutDate) {
      return res.status(400).json({ error: "Spare, quantity and date are required!" });
    }
    if (stockOutQuantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const spare = await Spare.findOne({ _id: spare_id, storeKeeper: req.session.user.id });
    if (!spare) return res.status(404).json({ error: "Spare not found" });
    if (spare.quantity < stockOutQuantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    const totalPrice = stockOutQuantity * spare.unitPrice;

    await StockOut.create({
      spare: spare_id,
      quantity: stockOutQuantity,
      totalPrice,
      date: stockOutDate,
      storeKeeper: req.session.user.id,
    });

    spare.quantity -= Number(stockOutQuantity);
    spare.totalPrice = spare.quantity * spare.unitPrice;
    await spare.save();

    await logActivity(req.session.user.email, "STOCK_OUT", `Removed ${stockOutQuantity} units of "${spare.name}"`, req.session.user.id);

    res.json({ message: "Stock removed successfully" });
  } catch (error) {
    console.error("Remove stock-out error:", error);
    res.status(500).json({ error: "Error while removing spare from stock!" });
  }
});

module.exports = router;
