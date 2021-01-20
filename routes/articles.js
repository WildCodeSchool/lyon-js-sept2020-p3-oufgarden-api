const articleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireIsAdmin = require('../middlewares/requireAdmin');
// const requireCurrentUser = require('../middlewares/requireCurrentUser');
const extractCurrentUser = require('../middlewares/extractCurrentUser');
const {
  handleGetArticles,
  handleGetOneArticle,
  handleCreateArticle,
  handleUpdateArticle,
  handleDeleteArticle,
} = require('../controllers/articles');
const mainUploadImage = require('../middlewares/handleImageUpload');

articleRouter.get('/', extractCurrentUser, asyncHandler(handleGetArticles));
articleRouter.get('/:id', asyncHandler(handleGetOneArticle));
articleRouter.post(
  '/',
  mainUploadImage,
  requireIsAdmin,
  asyncHandler(handleCreateArticle)
);
articleRouter.put(
  '/:id',
  mainUploadImage,
  requireIsAdmin,
  asyncHandler(handleUpdateArticle)
);
articleRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteArticle));

module.exports = { articleRouter };
