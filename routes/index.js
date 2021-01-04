// const thingsRoutes = require('./things');
const { userRouter } = require('./users');
const { articleRouter } = require('./articles');
const { tagToArticleRouter } = require('./tagToArticle');
const { adminLogin } = require('./loginBO');
const { tagRouter } = require('./tags');
const { gardenRouter } = require('./garden');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
  app.use('/articles', articleRouter);
  app.use('/tagToArticle', tagToArticleRouter);
  app.use('/login', adminLogin);
  app.use('/tags', tagRouter);
  app.use('/garden', gardenRouter);
  app.use('/login', adminLogin);
};
