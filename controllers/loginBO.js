const { isAdmin } = require('../models/loginBO.js');

module.exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await isAdmin({ email, password });
  if (data === 'logged') {
    return res.status(200).send('logged');
  }
  return res.sendStatus(403);
};
