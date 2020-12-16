const tagToArticleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetTagToArticle,
  //   handleGetOneArticle,
  //   handleCreateArticle,
  //   handleUpdateArticle,
  //   handleDeleteArticle,
} = require('../controllers/tagToArticle');

tagToArticleRouter.get('/', asyncHandler(handleGetTagToArticle));
// articleRouter.get('/:id', asyncHandler(handleGetOneArticle));
// articleRouter.post('/', asyncHandler(handleCreateArticle));
// articleRouter.put('/:id', asyncHandler(handleUpdateArticle));
// articleRouter.delete('/:id', asyncHandler(handleDeleteArticle));

module.exports = { tagToArticleRouter };
