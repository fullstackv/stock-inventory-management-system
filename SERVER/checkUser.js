// One-off diagnostic script. Run from the SERVER folder:
//   node checkUser.js someone@example.com
//
// Prints exactly what's stored for that account - role, isActive,
// mustChangePassword, everything - straight from the database your
// app is actually connected to, bypassing login/session/frontend
// entirely. Delete this file once you're done debugging.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const email = process.argv[2];

if (!email) {
  console.log("Usage: node checkUser.js <email>");
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sims";

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB:", mongoose.connection.name);

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    console.log(`\nNo user found with email "${email}".`);
  } else {
    console.log("\nRaw user document:");
    console.log(JSON.stringify(user.toObject(), null, 2));
    console.log(`\nrole is exactly: "${user.role}" (type: ${typeof user.role})`);
  }

  await mongoose.disconnect();
})();