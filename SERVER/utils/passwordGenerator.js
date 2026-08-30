// Every storekeeper is given the same default password when their account
// is created (or reset) by the owner. They're forced to change it on first
// login (see mustChangePassword on the User model / the change-password
// flow), so this being shared/predictable is fine - it's a one-time,
// single-use credential per account, not a long-lived password.
const DEFAULT_STOREKEEPER_PASSWORD = "StoreKeeper@SIMS";

const generateTempPassword = () => DEFAULT_STOREKEEPER_PASSWORD;

module.exports = { generateTempPassword, DEFAULT_STOREKEEPER_PASSWORD };
