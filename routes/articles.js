const articleRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetArticles,
  handleGetOneArticle,
  //   handleCreateUser,
  //   handleUpdateUser,
  //   handleDeleteUser,
} = require('../controllers/articles');

articleRouter.get('/', asyncHandler(handleGetArticles));
articleRouter.get('/:id', asyncHandler(handleGetOneArticle));
// articleRouter.post('/', asyncHandler(handleCreateUser));
// articleRouter.put('/:id', asyncHandler(handleUpdateUser));
// articleRouter.delete('/:id', asyncHandler(handleDeleteUser));

module.exports = { articleRouter };
