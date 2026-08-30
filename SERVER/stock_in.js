const router = require("express").Router();
const Spare = require("./models/Spare");
const StockIn = require("./models/StockIn");
const { logActivity } = require("./utils/activityLogger");

const { requireAuth, requireRole } = require("./auth/middleWare");

router.use("/stockin", requireAuth, requireRole("storekeeper"));

// GET all stock-in records for this storekeeper
router.get("/stockin", async (req, res) => {
  try {
    const records = await StockIn.find({ storeKeeper: req.session.user.id })
      .populate("spare", "name sku")
      .sort({ date: -1 });

    const shaped = records.map((r) => ({
      name: r.spare?.name || "(deleted spare)",
      stockInQuantity: r.quantity,
      stockInDate: r.date,
    }));

    res.json(shaped);
  } catch (error) {
    console.error("Fetch stock-in error:", error);
    res.status(500).json({ error: "Failed to fetch stock in data" });
  }
});

// ADD STOCK IN
router.post("/stockin", async (req, res) => {
  const { spare_id, stockInQuantity, stockInDate } = req.body;
  try {
    if (!spare_id || !stockInQuantity || !stockInDate) {
      return res.status(400).json({ error: "Spare, quantity and date are required!" });
    }
    if (stockInQuantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const spare = await Spare.findOne({ _id: spare_id, storeKeeper: req.session.user.id });
    if (!spare) return res.status(404).json({ error: "Spare not found" });

    await StockIn.create({
      spare: spare_id,
      quantity: stockInQuantity,
      date: stockInDate,
      storeKeeper: req.session.user.id,
    });

    spare.quantity += Number(stockInQuantity);
    spare.totalPrice = spare.quantity * spare.unitPrice;
    await spare.save();

    await logActivity(req.session.user.email, "STOCK_IN", `Added ${stockInQuantity} units to "${spare.name}"`, req.session.user.id);

    res.json({ message: "Stock added successfully" });
  } catch (error) {
    console.error("Add stock-in error:", error);
    res.status(500).json({ error: "Error while adding new spare in stock!" });
  }
});

module.exports = router;
