const db = require("../db");

const isAdmin = async (attributes) => {
  const { email, password } = attributes;
  const rows = await db.query(
    "SELECT * FROM user WHERE email = ? AND password = ? AND is_admin = 1",
    [email, password]
  );
  if (rows.length) {
    return "logged";
  }
  return "invalid credentials";
};
module.exports = { isAdmin };
