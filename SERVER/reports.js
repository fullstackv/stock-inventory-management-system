const express = require("express");
const reportsRouter = express.Router();
const db = require("./conn");
const authMiddleware = require("./auth/middleWare");

// GET REPORTS
reportsRouter.get("/reports", authMiddleware, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let stockInQuery = `
      SELECT 'IN' as type, p.name, s.stockInQuantity as quantity, s.stockInDate as date
      FROM stock_in s
      JOIN spares p ON s.spare_id = p.id
      WHERE 1=1
    `;

    let stockOutQuery = `
      SELECT 'OUT' as type, p.name, o.stockOutQuantity as quantity, o.stockOutDate as date
      FROM stock_out o
      JOIN spares p ON o.spare_id = p.id
      WHERE 1=1
    `;

    let params = [];

    if (startDate && endDate) {
      stockInQuery += " AND s.stockInDate BETWEEN ? AND ?";
      stockOutQuery += " AND o.stockOutDate BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    let finalQuery = "";

    if (type === "stockin") {
      finalQuery = stockInQuery;
    } else if (type === "stockout") {
      finalQuery = stockOutQuery;
    } else {
      finalQuery = `${stockInQuery} UNION ALL ${stockOutQuery}`;
    }

    const [rows] = await db.execute(finalQuery, [...params, ...params]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports", error });
  }
});

module.exports = reportsRouter;