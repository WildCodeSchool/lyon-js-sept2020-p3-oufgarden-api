const reservationRouter = require('express').Router();
const asyncHandler = require('express-async-handler');

const {
  handleGetReservations,
  handleCreateReservation,
  handleGetGardenReservation,
  handleGetMultipleGardenReservation,
} = require('../controllers/reservation');
const extractCurrentUser = require('../middlewares/extractCurrentUser');

reservationRouter.get('/', asyncHandler(handleGetReservations));
reservationRouter.get(
  '/:id',
  extractCurrentUser,
  asyncHandler(handleGetGardenReservation)
);
reservationRouter.get(
  '/multiple/:id',
  extractCurrentUser,
  asyncHandler(handleGetMultipleGardenReservation)
);
reservationRouter.post(
  '/',
  extractCurrentUser,
  asyncHandler(handleCreateReservation)
);

module.exports = { reservationRouter };
