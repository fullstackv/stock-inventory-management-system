// Vercel serverless entry point. Any file under /api that exports a
// request handler becomes a function; Express apps work directly here
// since `app` itself is a valid (req, res) handler. vercel.json rewrites
// every path to this one function so Express's own router (in app.js)
// still does the /login, /spares, etc. matching exactly as before.
module.exports = require("../app");