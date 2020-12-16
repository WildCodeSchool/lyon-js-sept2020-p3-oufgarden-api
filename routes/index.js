// const thingsRoutes = require('./things');
const { userRouter } = require('./users');
const { adminLogin } = require('./loginBO');
const { articleRouter } = require('./articles');
const { tagRouter } = require('./tags');
const { tagToArticleRouter } = require('./tagToArticle');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
  app.use('/tags', tagRouter);
  app.use('/articles', articleRouter);
  app.use('/login', adminLogin);
  app.use('/tagToArticle', tagToArticleRouter);
};
