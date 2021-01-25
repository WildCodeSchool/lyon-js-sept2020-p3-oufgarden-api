const reservationRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
// const requireIsAdmin = require('../middlewares/requireAdmin');
const {
  handleGetReservations,
  handleCreateReservation,
  handleGetGardenReservation,
  //   handleGetOneTag,
  //   handleCreateTag,
  //   handleUpdateTag,
  //   handleDeleteTag,
} = require('../controllers/reservation');
const extractCurrentUser = require('../middlewares/extractCurrentUser');

reservationRouter.get('/', asyncHandler(handleGetReservations));
reservationRouter.get(
  '/:id',
  extractCurrentUser,
  asyncHandler(handleGetGardenReservation)
);
reservationRouter.post(
  '/',
  extractCurrentUser,
  asyncHandler(handleCreateReservation)
);
// tagRouter.put('/:id', requireIsAdmin, asyncHandler(handleUpdateTag));
// tagRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteTag));

module.exports = { reservationRouter };
