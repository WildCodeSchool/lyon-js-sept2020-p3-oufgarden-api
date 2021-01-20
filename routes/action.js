const actionRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireIsAdmin = require('../middlewares/requireAdmin');
const {
  handleGetActions,
  handleGetOnAction,
  handleCreateAction,
  handleUpdateAction,
  handleDeleteAction,
} = require('../controllers/actions');

actionRouter.get('/', asyncHandler(handleGetActions));
actionRouter.get('/:id', asyncHandler(handleGetOnAction));
actionRouter.post('/', requireIsAdmin, asyncHandler(handleCreateAction));
actionRouter.put('/:id', requireIsAdmin, asyncHandler(handleUpdateAction));
actionRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteAction));

module.exports = { actionRouter };
