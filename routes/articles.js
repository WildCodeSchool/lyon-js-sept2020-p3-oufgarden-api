const articleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireIsAdmin = require('../middlewares/requireAdmin');
const {
  handleGetArticles,
  handleGetOneArticle,
  handleCreateArticle,
  handleUpdateArticle,
  handleDeleteArticle,
  handleGetFavorites,
} = require('../controllers/articles');
const mainUploadImage = require('../middlewares/handleImageUpload');

articleRouter.get('/', asyncHandler(handleGetArticles));
articleRouter.get('/favorites', asyncHandler(handleGetFavorites));
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
