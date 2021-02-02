const articleRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const requireIsAdmin = require("../middlewares/requireAdmin");
// const requireCurrentUser = require('../middlewares/requireCurrentUser');
const extractCurrentUser = require("../middlewares/extractCurrentUser");
const {
  handleGetArticles,
  handleGetOneArticle,
  handleCreateArticle,
  handleUpdateArticle,
  handleDeleteArticle,
  handleGetFavorites,
  handleCreateFavorite,
  handleDeleteFavorite,
} = require("../controllers/articles");
const mainUploadImage = require("../middlewares/handleImageUpload");

articleRouter.get(
  "/favorites",
  extractCurrentUser,
  asyncHandler(handleGetFavorites)
);
articleRouter.post(
  "/favorites",
  extractCurrentUser,
  asyncHandler(handleCreateFavorite)
);
articleRouter.delete(
  "/favorites/:id",
  extractCurrentUser,
  asyncHandler(handleDeleteFavorite)
);

articleRouter.get("/", extractCurrentUser, asyncHandler(handleGetArticles));
articleRouter.get(
  "/:id",
  extractCurrentUser,
  asyncHandler(handleGetOneArticle)
);
articleRouter.post(
  "/",
  mainUploadImage,
  requireIsAdmin,
  asyncHandler(handleCreateArticle)
);
articleRouter.put(
  "/:id",
  mainUploadImage,
  requireIsAdmin,
  asyncHandler(handleUpdateArticle)
);
articleRouter.delete("/:id", requireIsAdmin, asyncHandler(handleDeleteArticle));

module.exports = { articleRouter };
