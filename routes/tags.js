const tagRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireIsAdmin = require('../middlewares/requireAdmin');
const {
  handleGetTags,
  handleGetOneTag,
  handleCreateTag,
  handleUpdateTag,
  handleDeleteTag,
} = require('../controllers/tags');

tagRouter.get('/', asyncHandler(handleGetTags));
tagRouter.get('/:id', asyncHandler(handleGetOneTag));
tagRouter.post('/', requireIsAdmin, asyncHandler(handleCreateTag));
tagRouter.put('/:id', requireIsAdmin, asyncHandler(handleUpdateTag));
tagRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteTag));

module.exports = { tagRouter };
