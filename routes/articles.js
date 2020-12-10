const articleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetArticles,
  handleGetOneArticle,
  handleCreateArticle,
  handleUpdateArticle,
  //   handleDeleteUser,
} = require('../controllers/articles');

articleRouter.get('/', asyncHandler(handleGetArticles));
articleRouter.get('/:id', asyncHandler(handleGetOneArticle));
articleRouter.post('/creation', asyncHandler(handleCreateArticle));
articleRouter.put('/:id', asyncHandler(handleUpdateArticle));
// articleRouter.delete('/:id', asyncHandler(handleDeleteUser));

module.exports = { articleRouter };
