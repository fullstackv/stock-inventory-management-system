// Local dev / traditional-host entry point (e.g. `npm run dev`, or Render).
// Not used on Vercel - see api/index.js, which imports the same app.js
// but hands it to the serverless runtime instead of calling app.listen().
const app = require("./app");
const { connectDB } = require("./db");

const port = process.env.PORT || 8000;

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
  });
};

start();