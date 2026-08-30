const router = require("express").Router();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Spare = require("./models/Spare");
const { logActivity } = require("./utils/activityLogger");

// All inventory routes are storekeeper-only, scoped to that storekeeper's
// own data. Owners never see or touch inventory - they only manage
// storekeeper accounts via storekeepers.js.
const { requireAuth, requireRole } = require("./auth/middleWare");

router.use("/categories", requireAuth, requireRole("storekeeper"));

// GET ALL CATEGORIES (with live spare counts, scoped to this storekeeper)
router.get("/categories", async (req, res) => {
  try {
    const storeKeeper = new mongoose.Types.ObjectId(req.session.user.id);
    const categories = await Category.aggregate([
      { $match: { storeKeeper } },
      {
        $lookup: {
          from: "spares",
          localField: "_id",
          foreignField: "category",
          as: "spares",
        },
      },
      {
        $addFields: {
          spareCount: { $size: "$spares" },
          totalQuantity: { $sum: "$spares.quantity" },
        },
      },
      { $project: { spares: 0 } },
      { $sort: { name: 1 } },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// CREATE CATEGORY
router.post("/categories", async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required!" });
    }
    const existing = await Category.findOne({ storeKeeper: req.session.user.id, name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: "A category with this name already exists!" });
    }
    const category = await Category.create({
      name: name.trim(),
      description: description || null,
      storeKeeper: req.session.user.id,
    });
    await logActivity(req.session.user.email, "CREATE_CATEGORY", `Created category "${name}"`, req.session.user.id);
    res.status(201).json({ message: "Category created successfully!", id: category._id });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// UPDATE CATEGORY
router.put("/categories/:id", async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required!" });
    }
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, storeKeeper: req.session.user.id },
      { name: name.trim(), description: description || null },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });

    await logActivity(req.session.user.email, "UPDATE_CATEGORY", `Updated category "${category.name}"`, req.session.user.id);
    res.status(200).json({ message: "Category updated successfully!" });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE CATEGORY
router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, storeKeeper: req.session.user.id });
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Uncategorize any spares that referenced it, rather than orphaning the reference.
    await Spare.updateMany({ category: category._id, storeKeeper: req.session.user.id }, { category: null });

    await logActivity(req.session.user.email, "DELETE_CATEGORY", `Deleted category "${category.name}"`, req.session.user.id);
    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
