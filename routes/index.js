// const thingsRoutes = require('./things');
const { userRouter } = require('./users');
const { articleRouter } = require('./articles');
const { tagToArticleRouter } = require('./tagToArticle');
const { adminLogin } = require('./login');
const { tagRouter } = require('./tags');
const { gardenRouter } = require('./garden');
const { plantFamilyRouter } = require('./plantFamily.js');
const { frontLogin } = require('./login');
const { timeSlotRouter } = require('./timeSlots');
const { reservationRouter } = require('./reservation');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', userRouter);
  app.use('/articles', articleRouter);
  app.use('/tagToArticle', tagToArticleRouter);
  app.use('/tags', tagRouter);
  app.use('/garden', gardenRouter);
  app.use('/login', adminLogin);
  app.use('/plantFamily', plantFamilyRouter);
  app.use('/app/login', frontLogin);
  app.use('/timeSlots', timeSlotRouter);
  app.use('/reservation', reservationRouter);
};
