const router = require("express").Router();
const Spare = require("./models/Spare");
const { logActivity } = require("./utils/activityLogger");


const { requireAuth, requireRole } = require("./auth/middleWare");

router.use("/spares", requireAuth, requireRole("storekeeper"));

// GET /spares - advanced list: search, category/supplier filters,
// low-stock-only filter, and pagination. Used by the Spares management page.
router.get("/spares", async (req, res) => {
  try {
    const { search, category_id, supplier_id, lowStockOnly, page = 1, limit = 10 } = req.query;

    const filter = { storeKeeper: req.session.user.id };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }
    if (category_id) filter.category = category_id;
    if (supplier_id) filter.supplier = supplier_id;
    if (lowStockOnly === "true") {
      filter.$expr = { $lte: ["$quantity", "$minStockLevel"] };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    const [total, spares] = await Promise.all([
      Spare.countDocuments(filter),
      Spare.find(filter)
        .populate("category", "name")
        .populate("supplier", "name")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
    ]);

    res.status(200).send({
      data: spares,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    });
  } catch (error) {
    console.error("Fetch spares error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// GET /spares/all - plain unfiltered list, used to populate dropdowns
// elsewhere in the app (Stock In/Out, Adjustments).
router.get("/spares/all", async (req, res) => {
  try {
    const spares = await Spare.find({ storeKeeper: req.session.user.id })
      .populate("category", "name")
      .populate("supplier", "name")
      .sort({ name: 1 });
    res.status(200).send(spares);
  } catch (error) {
    console.error("Fetch all spares error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// CREATE SPARE
router.post("/spares", async (req, res) => {
  const { name, sku, category_id, supplier_id, quantity, unitPrice, minStockLevel, location } = req.body;
  try {
    if (!name || !quantity || !unitPrice) {
      return res.status(400).send({ error: "Name, quantity and unit price are required!" });
    }
    if (quantity <= 0) return res.status(400).send({ error: "Quantity must be greater than 0" });
    if (unitPrice <= 0) return res.status(400).send({ error: "Price must be greater than 0" });

    const totalPrice = quantity * unitPrice;
    const spare = await Spare.create({
      name,
      sku: sku && sku.trim() ? sku.trim() : null,
      category: category_id || null,
      supplier: supplier_id || null,
      quantity,
      minStockLevel: minStockLevel || 10,
      unitPrice,
      totalPrice,
      location: location || null,
      storeKeeper: req.session.user.id,
    });

    // Auto-generate a readable SKU when none was supplied
    if (!spare.sku) {
      spare.sku = `SP-${spare._id.toString().slice(-6).toUpperCase()}`;
      await spare.save();
    }

    await logActivity(req.session.user.email, "CREATE_SPARE", `Added spare "${name}"`, req.session.user.id);
    res.status(201).send({ message: "New product added in stock!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ error: "That SKU is already in use." });
    }
    console.error("Add spare error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// UPDATE SPARE
router.put("/spares/:id", async (req, res) => {
  const { name, sku, category_id, supplier_id, quantity, unitPrice, minStockLevel, location } = req.body;
  try {
    if (!name || quantity === undefined || !unitPrice) {
      return res.status(400).send({ error: "Name, quantity and unit price are required!" });
    }
    const totalPrice = quantity * unitPrice;
    const spare = await Spare.findOneAndUpdate(
      { _id: req.params.id, storeKeeper: req.session.user.id },
      {
        name,
        sku: sku || null,
        category: category_id || null,
        supplier: supplier_id || null,
        quantity,
        minStockLevel: minStockLevel || 10,
        unitPrice,
        totalPrice,
        location: location || null,
      },
      { new: true }
    );
    if (!spare) return res.status(404).send({ error: "Spare not found" });

    await logActivity(req.session.user.email, "UPDATE_SPARE", `Updated spare "${spare.name}"`, req.session.user.id);
    res.status(200).send({ message: "Spare updated successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ error: "That SKU is already in use." });
    }
    console.error("Update spare error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// DELETE SPARE
router.delete("/spares/:id", async (req, res) => {
  try {
    const spare = await Spare.findOneAndDelete({ _id: req.params.id, storeKeeper: req.session.user.id });
    if (!spare) return res.status(404).send({ error: "Spare not found" });

    await logActivity(req.session.user.email, "DELETE_SPARE", `Deleted spare "${spare.name}"`, req.session.user.id);
    res.status(200).send({ message: "Spare deleted successfully!" });
  } catch (error) {
    console.error("Delete spare error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
