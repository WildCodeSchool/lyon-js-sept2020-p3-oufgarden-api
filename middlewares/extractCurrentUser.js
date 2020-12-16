const { getOneUser } = require('../models/users.js');

module.exports = async (req, res, next) => {
  req.currentUser = await getOneUser(req.session.userId, false);
  next();
};
