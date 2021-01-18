const commentRouter = require('express').Router();
const asyncHandler = require('express-async-handler');

const {
  handleGetComments,
  handleGetOneComment,
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
} = require('../controllers/comments');

commentRouter.get('/', asyncHandler(handleGetComments));
commentRouter.get('/:id', asyncHandler(handleGetOneComment));
commentRouter.post('/', asyncHandler(handleCreateComment));
commentRouter.put('/:id', asyncHandler(handleUpdateComment));
commentRouter.delete('/:id', asyncHandler(handleDeleteComment));
// you will need to be admin to delete a comment

module.exports = { commentRouter };
