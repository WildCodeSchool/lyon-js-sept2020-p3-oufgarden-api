const { findAdmin } = require('../models/users');

module.exports = async (req, res, next) => {
  console.log(req.session);
  req.isAdmin = await findAdmin(req.session.userId);

  if (!req.isAdmin) {
    return res.status(401).send('');
  }

  return next();
};
