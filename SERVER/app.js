// Builds and exports the configured Express app *without* calling
// app.listen(). Local dev (server.js) and Vercel (api/index.js) both
// import this file and each decide how to run it - listen on a port,
// or hand it to the serverless runtime as a request handler.
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db");

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

const app = express();

// Required so "secure" cookies are set correctly when running behind a
// platform proxy/load balancer (Vercel, Render, Railway, etc.) - without
// this, Express can't tell the request was actually HTTPS.
app.set("trust proxy", 1);

app.use(express.json());
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// Make sure Mongo is connected before any route runs. On a persistent
// server (local dev, Render) this resolves once and every later request
// skips straight through. On Vercel, a cold-started function has no
// guaranteed connection yet, so every request awaits the (cached) promise
// from db.js - cheap once warm, but never skipped.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ error: "Database unavailable, please try again shortly." });
  }
});

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      // A promise (not a raw URL) so connect-mongo waits for and reuses
      // the *same* mongoose connection lazily, instead of eagerly opening
      // its own MongoClient the instant this file is required - which
      // previously could crash the whole process on load if Mongo was
      // briefly unreachable, before a single request had even come in.
      clientPromise: connectDB().then((m) => m.connection.getClient()),
      collectionName: "sessions",
      // Without this, connect-mongo re-writes the session doc on *every*
      // single request just to bump its expiry - turning a read-only
      // request like GET /dashboard into a read + a write. Since sessions
      // already last 6 hours, there's no need to re-touch more than once
      // an hour; this alone removes a full DB round trip from most requests.
      touchAfter: 60 * 60,
    }),
    cookie: {
      maxAge: 6000 * 60 * 60,
      // In production the frontend (Netlify) and backend (Vercel) live on
      // different domains, so the session cookie is cross-site: it needs
      // sameSite: "none" + secure: true or the browser silently drops it.
      // Locally both run on http://localhost, where "none" would be
      // rejected, so this only kicks in for NODE_ENV=production.
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

module.exports = app;