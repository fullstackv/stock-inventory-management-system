const crypto = require("crypto");

// Generates a readable-ish random temporary password, e.g. "Kx7-mQ2p-9Rt4".
// Good enough entropy for a temp credential the storekeeper is forced to
// change on first login.
const generateTempPassword = () => {
  const chunk = () => crypto.randomBytes(3).toString("hex");
  return `${chunk()}-${chunk()}-${chunk()}`;
};

module.exports = { generateTempPassword };
