const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const handleImageUpload = require('../middlewares/handleImageUpload');
const { getCollection, handleGarden } = require('../controllers/garden');

gardenRouter.get('/', asyncHandler(gardenRouter));

gardenRouter.post('/', asyncHandler(getCollection));
gardenRouter.post('/', handleImageUpload, asyncHandler(handleGarden));

module.exports = gardenRouter;
