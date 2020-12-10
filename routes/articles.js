const articleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetArticles,
  handleGetOneArticle,
  handleCreateArticle,
  //   handleUpdateUser,
  //   handleDeleteUser,
} = require('../controllers/articles');

articleRouter.get('/', asyncHandler(handleGetArticles));
articleRouter.get('/:id', asyncHandler(handleGetOneArticle));
articleRouter.post('/creation', asyncHandler(handleCreateArticle));
// articleRouter.put('/:id', asyncHandler(handleUpdateUser));
// articleRouter.delete('/:id', asyncHandler(handleDeleteUser));

module.exports = { articleRouter };
