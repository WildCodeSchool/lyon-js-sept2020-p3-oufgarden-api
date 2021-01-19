const reservationRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
// const requireIsAdmin = require('../middlewares/requireAdmin');
const {
  handleGetReservations,
  //   handleGetOneTag,
  //   handleCreateTag,
  //   handleUpdateTag,
  //   handleDeleteTag,
} = require('../controllers/reservation');

reservationRouter.get('/', asyncHandler(handleGetReservations));
// tagRouter.get('/:id', asyncHandler(handleGetOneTag));
// tagRouter.post('/', requireIsAdmin, asyncHandler(handleCreateTag));
// tagRouter.put('/:id', requireIsAdmin, asyncHandler(handleUpdateTag));
// tagRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteTag));

module.exports = { reservationRouter };
