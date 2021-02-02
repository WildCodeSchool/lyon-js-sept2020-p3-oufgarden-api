const reservationRouter = require("express").Router();
const asyncHandler = require("express-async-handler");

const {
  handleGetReservations,
  handleCreateReservation,
  handleGetGardenReservation,
} = require("../controllers/reservation");
const extractCurrentUser = require("../middlewares/extractCurrentUser");

reservationRouter.get("/", asyncHandler(handleGetReservations));
reservationRouter.get(
  "/:id",
  extractCurrentUser,
  asyncHandler(handleGetGardenReservation)
);
reservationRouter.post(
  "/",
  extractCurrentUser,
  asyncHandler(handleCreateReservation)
);

module.exports = { reservationRouter };
