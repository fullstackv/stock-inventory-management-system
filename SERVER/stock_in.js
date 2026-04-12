
const express = require("express");
const stockInRouter = express.Router();
const db = require("./conn");
const authMiddleware = require("./auth/middleWare");

// ADD STOCK IN
stockInRouter.post("/stockin", authMiddleware, async (req, res) => {
  try {
    const { spare_id, stockInQuantity, stockInDate } = req.body;
    if (!spare_id || !stockInQuantity || !stockInDate) {
            return res.status(400).send({error: "All fields are required!"})
        }

    // INSERT STOCK IN
    const insertStockIn = `
            INSERT INTO stock_in (spare_id, stockInQuantity, stockInDate)
            VALUES (?, ?, ?)
        `;

    await db.execute(insertStockIn, [spare_id, stockInQuantity, stockInDate]);

    // UPDATE SPARE
    const updateSpare = `
            UPDATE spares
            SET quantity = quantity + ?,
                totalPrice = quantity * unitPrice
            WHERE id = ?
        `;

    await db.execute(updateSpare, [stockInQuantity, spare_id]);

    res.json({ message: "Stock added successfully" });
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Error while adding new spare in stock!", error});
  }
});

// GET ALL STOCK IN
stockInRouter.get("/stockin", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT p.name, s.stockInQuantity, s.stockInDate FROM stock_in s JOIN spares p ON s.spare_id = p.id");
    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = stockInRouter;
