const articleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetArticles,
  handleGetOneArticle,
  handleCreateArticle,
  handleUpdateArticle,
  handleDeleteArticle,
} = require('../controllers/articles');

articleRouter.get('/', asyncHandler(handleGetArticles));
articleRouter.get('/:id', asyncHandler(handleGetOneArticle));
articleRouter.post('/', asyncHandler(handleCreateArticle));
articleRouter.put('/:id', asyncHandler(handleUpdateArticle));
articleRouter.delete('/:id', asyncHandler(handleDeleteArticle));

module.exports = { articleRouter };
