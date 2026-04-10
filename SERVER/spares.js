const authMiddleware = require('./auth/middleWare');
const db = require('./conn');

const apps = require('express').Router()


apps.post('/spares', authMiddleware, async (req, res) => {
    const { name, category, quantity, unitPrice } = req.body
    const totalPrice = quantity * unitPrice
    try {
        if (!name || !category || !quantity || !unitPrice) {
            return res.status(400).send({ error: "All fields are required!" });
        }
        if (quantity <= 0) {
            return res.status(400).send({error: "Quantity must be greater than 0"})
        }
        if (unitPrice <= 0) {
            return res.status(400).send({error: "Price must be greater than 0"})
        }
        const sql = "INSERT INTO `spares`(`name`, `category`, `quantity`, `unitPrice`, `totalPrice`) VALUES (?,?,?,?,?)";
        await db.query(sql, [name, category, quantity, unitPrice, totalPrice])
        res.status(201).send({message: "New product added in stock!"})
    } catch (error) {
        res.status(500).send({error: "Internal Server Error",error})
    }
})


apps.get('/spares', authMiddleware, async (req, res) => {
    try {
        const [products] = await db.query("SELECT * FROM spares")
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send({error: "Internal Server Error",error})
    }
})



module.exports = apps

