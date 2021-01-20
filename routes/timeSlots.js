const timeSlotRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
// const requireIsAdmin = require('../middlewares/requireAdmin');
const {
  handleGetTimeSlots,
  //   handleGetOneTag,
  //   handleCreateTag,
  //   handleUpdateTag,
  //   handleDeleteTag,
} = require('../controllers/timeSlots');

timeSlotRouter.get('/', asyncHandler(handleGetTimeSlots));
// timeSlotRouter.get('/:id', asyncHandler(handleGetOneTag));
// timeSlotRouter.post('/', requireIsAdmin, asyncHandler(handleCreateTag));
// timeSlotRouter.put('/:id', requireIsAdmin, asyncHandler(handleUpdateTag));
// timeSlotRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteTag));

module.exports = { timeSlotRouter };
