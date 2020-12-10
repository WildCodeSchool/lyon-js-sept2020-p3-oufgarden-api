const { isAdmin } = require('../models/login.js');

module.exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await isAdmin({ email, password });
  return res.status(200).send(data);
};
