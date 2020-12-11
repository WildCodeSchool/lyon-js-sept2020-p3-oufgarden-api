// const thingsRoutes = require('./things');
const { userRouter } = require('./users');
const { adminLogin } = require('./loginBO');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
  app.use('/login', adminLogin);
};
