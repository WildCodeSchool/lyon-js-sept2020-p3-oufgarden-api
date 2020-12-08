// const thingsRoutes = require('./things');
const { userRouter } = require('./users');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
};
