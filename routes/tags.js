const tagRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetTags,
  handleGetOneTag,
  handleCreateTag,
  handleUpdateTag,
  handleDeleteTag,
} = require('../controllers/tags');

tagRouter.get('/', asyncHandler(handleGetTags));
tagRouter.get('/:id', asyncHandler(handleGetOneTag));
tagRouter.post('/', asyncHandler(handleCreateTag));
tagRouter.put('/:id', asyncHandler(handleUpdateTag));
tagRouter.delete('/:id', asyncHandler(handleDeleteTag));

module.exports = { tagRouter };
