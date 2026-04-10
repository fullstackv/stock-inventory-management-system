const express = require("express");
const session = require("express-session");
const cors = require('cors')
const app = express();
const port = 8000;
const router = require('./auth/authenticate')
const apps = require('./spares')

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(
  session({
    secret: "sims_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6000 * 60 * 60,
    },
  }),
);
app.use(router)
app.use(apps)

app.listen(port, ()=> {
    console.log(`App is running on port: ${port}`)
})