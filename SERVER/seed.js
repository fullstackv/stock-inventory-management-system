// Seeds (or updates) the single owner account this system is designed to
// have. Public owner registration has been removed - this is the only way
// an owner account gets created.
//
// Usage:
//   node seed.js
//
// Credentials come from the environment (see .env.example):
//   OWNER_FULLNAMES  - defaults to "System Owner"
//   OWNER_EMAIL      - required
//   OWNER_PHONE      - optional
//   OWNER_PASSWORD   - required
//
// Safe to re-run: if an owner with OWNER_EMAIL already exists, this updates
// their name/phone/password instead of creating a duplicate. It also
// guards against ending up with two different owner accounts, since the
// system is meant to have exactly one.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, mongoose } = require("./db");
const User = require("./models/User");

const run = async () => {
  const fullnames = process.env.OWNER_FULLNAMES || "System Owner";
  const email = (process.env.OWNER_EMAIL || "").toLowerCase().trim();
  const phone = process.env.OWNER_PHONE || "";
  const password = process.env.OWNER_PASSWORD || "";

  if (!email || !password) {
    console.error(
      "Missing OWNER_EMAIL and/or OWNER_PASSWORD in your environment (.env). Set them and re-run `node seed.js`."
    );
    process.exit(1);
  }

  await connectDB();

  try {
    const existingOwner = await User.findOne({ role: "owner" });

    if (existingOwner && existingOwner.email !== email) {
      console.error(
        `An owner account already exists (${existingOwner.email}). This system supports only one owner. ` +
          `If you meant to change the owner's email, update it directly, or update OWNER_EMAIL to match ` +
          `the existing owner and re-run this script to just rotate their password.`
      );
      process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 10);

    if (existingOwner) {
      existingOwner.fullnames = fullnames;
      existingOwner.phone = phone;
      existingOwner.password = hashed;
      existingOwner.isActive = true;
      existingOwner.mustChangePassword = false;
      await existingOwner.save();
      console.log(`Owner account updated: ${existingOwner.email}`);
    } else {
      const owner = await User.create({
        fullnames,
        email,
        phone,
        password: hashed,
        role: "owner",
        isActive: true,
        mustChangePassword: false,
      });
      console.log(`Owner account created: ${owner.email}`);
    }
  } catch (error) {
    console.error("Seeding owner failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

run();
