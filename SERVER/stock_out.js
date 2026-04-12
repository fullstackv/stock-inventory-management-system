const express = require("express");
const stockOutRouter = express.Router();
const db = require("./conn");
const authMiddleware = require("./auth/middleWare");

// ADD STOCK OUT
stockOutRouter.post("/stockout", authMiddleware, async (req, res) => {
    try {
        const { spare_id, stockOutQuantity, stockOutDate } = req.body;
        if (!spare_id || !stockOutQuantity || !stockOutDate) {
            return res.status(400).send({error: "All fields are required!"})
        }

        // CHECK AVAILABLE STOCK
        const [rows] = await db.execute(
            "SELECT quantity, unitPrice FROM spares WHERE id = ?",
            [spare_id]
        );

        const spare = rows[0];

        if (!spare) {
            return res.status(404).json({ error: "Spare not found" });
        }

        if (spare.quantity < stockOutQuantity) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        const totalPrice = stockOutQuantity * spare.unitPrice;

        // INSERT STOCK OUT
        const insertStockOut = `
            INSERT INTO stock_out
            (spare_id, stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(insertStockOut, [
            spare_id,
            stockOutQuantity,
            spare.unitPrice,
            totalPrice,
            stockOutDate
        ]);

        // UPDATE SPARE
        const updateSpare = `
            UPDATE spares
            SET quantity = quantity - ?,
                totalPrice = quantity * unitPrice
            WHERE id = ?
        `;

        await db.execute(updateSpare, [
            stockOutQuantity,
            spare_id
        ]);

        res.json({ message: "Stock removed successfully" });

    } catch (error) {
        res.status(500).json({error: "Error while removing spare from stock!", error});
    }
});

// GET ALL STOCK OUT
stockOutRouter.get("/stockout", authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT `s`.`name`, `o`.`stockOutQuantity`, `o`.`stockOutTotalPrice`, `o`.`stockOutDate` FROM stock_out o JOIN spares s ON `o`.`spare_id` = `s`.`id`");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Filed to fetch stock out data", error});
    }
});

// UPDATE STOCK OUT
stockOutRouter.put("/stockout/:id", authMiddleware, async (req, res) => {
    try {
        const { stockOutQuantity, stockOutUnitPrice, stockOutDate } = req.body;

        const totalPrice = stockOutQuantity * stockOutUnitPrice;

        const sql = `
            UPDATE stock_out
            SET stockOutQuantity=?, stockOutUnitPrice=?, stockOutTotalPrice=?, stockOutDate=?
            WHERE id=?
        `;

        await db.execute(sql, [
            stockOutQuantity,
            stockOutUnitPrice,
            totalPrice,
            stockOutDate,
            req.params.id
        ]);

        res.json({ message: "Stock out updated" });

    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE STOCK OUT
stockOutRouter.delete("/stockout/:id", authMiddleware, async (req, res) => {
    try {
        await db.execute("DELETE FROM stock_out WHERE id = ?", [req.params.id]);
        res.json({ message: "Stock out deleted" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = stockOutRouter;