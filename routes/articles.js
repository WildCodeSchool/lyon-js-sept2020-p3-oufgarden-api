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
  handleCreateFavorite,
  handleDeleteFavorite,
} = require('../controllers/articles');
const mainUploadImage = require('../middlewares/handleImageUpload');

articleRouter.get('/favorites', asyncHandler(handleGetFavorites));
articleRouter.post('/favorites', asyncHandler(handleCreateFavorite));
articleRouter.delete('/favorites', asyncHandler(handleDeleteFavorite));

articleRouter.get('/', asyncHandler(handleGetArticles));
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
