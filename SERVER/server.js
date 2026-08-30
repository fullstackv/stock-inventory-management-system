const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
require("dotenv").config();

const { connectDB, mongoose } = require("./db");

const app = express();
const port = process.env.PORT || 8000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const sessionSecret = process.env.SESSION_SECRET || "sims_dev_secret_change_me";

const authRouter = require("./auth/authenticate");
const storekeepersRouter = require("./storekeepers");
const sparesRouter = require("./spares");
const stockInRouter = require("./stock_in");
const stockOutRouter = require("./stock_out");
const reportsRouter = require("./reports");
const categoriesRouter = require("./categories");
const suppliersRouter = require("./suppliers");
const adjustmentsRouter = require("./adjustments");
const analyticsRouter = require("./analytics");

const start = async () => {
  // Connect Mongoose first, then hand its underlying client to connect-mongo
  // so the session store shares one connection instead of opening a second,
  // independent one - the previous approach could crash on startup with an
  // unhandled rejection if Mongo was briefly unreachable.
  await connectDB();

  app.use(express.json());
  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    })
  );

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: "sessions",
      }),
      cookie: {
        maxAge: 6000 * 60 * 60,
      },
    })
  );

  app.use(authRouter);
  app.use(storekeepersRouter);
  app.use(sparesRouter);
  app.use(stockInRouter);
  app.use(stockOutRouter);
  app.use(reportsRouter);
  app.use(categoriesRouter);
  app.use(suppliersRouter);
  app.use(adjustmentsRouter);
  app.use(analyticsRouter);

  app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
  });
};

start();
