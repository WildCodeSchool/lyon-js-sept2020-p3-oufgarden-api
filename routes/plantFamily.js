const plantFamilyRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const { handleGetPlantFamily } = require("../controllers/plantFamily");

plantFamilyRouter.get("/", asyncHandler(handleGetPlantFamily));

module.exports = { plantFamilyRouter };
