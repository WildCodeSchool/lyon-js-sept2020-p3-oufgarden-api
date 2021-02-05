const timeSlotRouter = require("express").Router();
const asyncHandler = require("express-async-handler");

const { handleGetTimeSlots } = require("../controllers/timeSlots");

timeSlotRouter.get("/", asyncHandler(handleGetTimeSlots));

module.exports = { timeSlotRouter };
