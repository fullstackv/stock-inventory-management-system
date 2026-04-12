const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../conn");
const authMiddleware = require("./middleWare");

router.post("/register", async (req, res) => {
  const { fullnames, email, phone, password } = req.body;
  try {
    if (!fullnames || !email || !phone || !password) {
      return res.status(400).send({ error: "All fields are required!" });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).send({ error: "Phone must be only numbers!" });
    }
    if (phone.length !== 10) {
      return res
        .status(400)
        .send({ error: "Phone length is invalid, Exact 10 numbers required!" });
    }
    if (password.length < 6) {
      return res.status(400).send({ error: "Password length is too short!" });
    }
    if (password.length > 12) {
      return res.status(400).send({ error: "Password length is too long!" });
    }
    const [userExist] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (userExist.length > 0) {
      return res
        .status(409)
        .send({ error: "Email already exist, try different one!" });
    }

    const hsh = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (fullnames, email, phone, password) VALUES(?,?,?,?)";
    await db.query(sql, [fullnames, email, phone, hsh]);
    res
      .status(201)
      .send({ success: true, message: "New user registered successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error",error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({ error: "All fields are required!" });
    }
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).send({ error: "Email not found!" });
    }
    console.log('Email ckecked...')
    const user = users[0]
    const isCorrect = await bcrypt.compare(password, user.password)
    if (!isCorrect) {
      return res.status(401).send({ error: "Password not match!" });
    }

    // delete user.password
    req.session.user = {
        names: user.fullnames,
        email: user.email
    }

    res.status(200).send({message: "User logged in successfully", user: req.session.user})

  } catch (error) {
    res.status(500).send({ error: "Internal Server Error",error });
  }
});


router.get('/dashboard', authMiddleware, (req, res) => {
    if (req.session.user) {
        res.send({user: req.session.user}) 
    }
})



router.post('/logout', (req, res) => {
    req.session.destroy((err)=> {
        if (err) {
            return res.send({error: "Failed to log out!"})
        }
        res.status(200).send({message: "Logout success!"})
    })
})

module.exports = router;
