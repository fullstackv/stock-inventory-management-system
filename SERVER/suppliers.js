const router = require("express").Router();
const mongoose = require("mongoose");
const Supplier = require("./models/Supplier");
const Spare = require("./models/Spare");
const { logActivity } = require("./utils/activityLogger");

const { requireAuth, requireRole } = require("./auth/middleWare");

router.use(requireAuth, requireRole("storekeeper"));

// GET ALL SUPPLIERS (with spare counts, scoped to this storekeeper)
router.get("/suppliers", async (req, res) => {
  try {
    const storeKeeper = new mongoose.Types.ObjectId(req.session.user.id);
    const suppliers = await Supplier.aggregate([
      { $match: { storeKeeper } },
      {
        $lookup: {
          from: "spares",
          localField: "_id",
          foreignField: "supplier",
          as: "spares",
        },
      },
      { $addFields: { spareCount: { $size: "$spares" } } },
      { $project: { spares: 0 } },
      { $sort: { name: 1 } },
    ]);
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Fetch suppliers error:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

// CREATE SUPPLIER
router.post("/suppliers", async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Supplier name is required!" });
    }
    const supplier = await Supplier.create({
      name: name.trim(),
      contact_person: contact_person || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      storeKeeper: req.session.user.id,
    });
    await logActivity(req.session.user.email, "CREATE_SUPPLIER", `Added supplier "${name}"`, req.session.user.id);
    res.status(201).json({ message: "Supplier added successfully!", id: supplier._id });
  } catch (error) {
    console.error("Create supplier error:", error);
    res.status(500).json({ error: "Failed to add supplier" });
  }
});

// UPDATE SUPPLIER
router.put("/suppliers/:id", async (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Supplier name is required!" });
    }
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, storeKeeper: req.session.user.id },
      { name: name.trim(), contact_person: contact_person || null, email: email || null, phone: phone || null, address: address || null },
      { new: true }
    );
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    await logActivity(req.session.user.email, "UPDATE_SUPPLIER", `Updated supplier "${supplier.name}"`, req.session.user.id);
    res.status(200).json({ message: "Supplier updated successfully!" });
  } catch (error) {
    console.error("Update supplier error:", error);
    res.status(500).json({ error: "Failed to update supplier" });
  }
});

// DELETE SUPPLIER
router.delete("/suppliers/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, storeKeeper: req.session.user.id });
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    await Spare.updateMany({ supplier: supplier._id, storeKeeper: req.session.user.id }, { supplier: null });

    await logActivity(req.session.user.email, "DELETE_SUPPLIER", `Deleted supplier "${supplier.name}"`, req.session.user.id);
    res.status(200).json({ message: "Supplier deleted successfully!" });
  } catch (error) {
    console.error("Delete supplier error:", error);
    res.status(500).json({ error: "Failed to delete supplier" });
  }
});

module.exports = router;
