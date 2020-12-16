const { UnauthorizedError } = require('../error-types');
const { getOneUser } = require('../models/users');

module.exports = async (req, res, next) => {
  req.currentUser = await getOneUser(req.session.userId, false);
  if (!req.currentUser) {
    return next(new UnauthorizedError());
  }
  return next();
};
