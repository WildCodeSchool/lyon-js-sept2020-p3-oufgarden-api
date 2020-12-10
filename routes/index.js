// const thingsRoutes = require('./things');
const { userRouter } = require('./users');
const { adminLogin } = require('./login');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
};

module.exports = (app) => {
  app.use('/login', adminLogin);
};
