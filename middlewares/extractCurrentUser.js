const { getOneUser } = require('../models/users.js');

module.exports = async (req, res, next) => {
  // console.log(req.currentUser);
  req.currentUser = await getOneUser(req.session.userId, false);
  return next();
};
