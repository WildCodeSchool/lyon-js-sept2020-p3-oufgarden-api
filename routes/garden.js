const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetGardens,
  handleGetOneGarden,
  handleCreateGarden,
  handleUpdateGarden,
  handleDeleteGarden,
} = require('../controllers/garden');

gardenRouter.get('/', asyncHandler(handleGetGardens));
gardenRouter.get('/:id', asyncHandler(handleGetOneGarden));
gardenRouter.post('/', asyncHandler(handleCreateGarden));
gardenRouter.put('/:id', asyncHandler(handleUpdateGarden));
gardenRouter.delete('/:id', asyncHandler(handleDeleteGarden));

module.exports = { gardenRouter };

/* const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const handleImageUpload = require('../middlewares/handleImageUpload');
const { getCollection, handleGarden } = require('../controllers/garden');

gardenRouter.get('/', asyncHandler(gardenRouter));

gardenRouter.post('/', asyncHandler(getCollection));
gardenRouter.post('/', handleImageUpload, asyncHandler(handleGarden));

module.exports = gardenRouter; */
