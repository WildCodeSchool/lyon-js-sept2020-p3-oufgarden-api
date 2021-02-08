// const thingsRoutes = require('./things');
const { userRouter } = require("./users");
const { articleRouter } = require("./articles");
const { tagToArticleRouter } = require("./tagToArticle");
const { adminLogin } = require("./login");
const { tagRouter } = require("./tags");
const { gardenRouter } = require("./garden");
const { plantFamilyRouter } = require("./plantFamily.js");
const { frontLogin } = require("./login");
const { commentRouter } = require("./comments");
const { timeSlotRouter } = require("./timeSlots");
const { reservationRouter } = require("./reservation");
const router = require("./currentUser");
const { actionRouter } = require("./action");
const requireCurrentUser = require("../middlewares/requireCurrentUser");

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use("/users", requireCurrentUser, userRouter);
  app.use("/articles", requireCurrentUser, articleRouter);
  app.use("/tagToArticle", requireCurrentUser, tagToArticleRouter);
  app.use("/tags", requireCurrentUser, tagRouter);
  app.use("/garden", requireCurrentUser, gardenRouter);
  app.use("/actions", requireCurrentUser, actionRouter);
  app.use("/login", adminLogin);
  app.use("/plantFamily", requireCurrentUser, plantFamilyRouter);
  app.use("/app/login", frontLogin);
  app.use("/comments", requireCurrentUser, commentRouter);
  app.use("/timeSlots", requireCurrentUser, timeSlotRouter);
  app.use("/reservation", requireCurrentUser, reservationRouter);
  app.use("/currentUser", requireCurrentUser, router);
};
