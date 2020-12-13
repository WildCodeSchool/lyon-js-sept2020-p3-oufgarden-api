// const thingsRoutes = require('./things');
const { userRouter } = require('./users');
const { adminLogin } = require('./loginBO');
const { articleRouter } = require('./articles');
const { tagRouter } = require('./tags');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
  app.use('/login', adminLogin);
  app.use('/articles', articleRouter);
  app.use('/tags', tagRouter);
};
