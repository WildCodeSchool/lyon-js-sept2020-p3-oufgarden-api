const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetGarden,
  handleGetOneGarden,
  handleCreateGarden,
  handleUpdateGarden,
  handleDeleteGarden,
} = require('../controllers/tags');

gardenRouter.get('/', asyncHandler(handleGetGarden));
gardenRouter.get('/:id', asyncHandler(handleGetOneGarden));
gardenRouter.post('/', asyncHandler(handleCreateGarden));
gardenRouter.put('/:id', asyncHandler(handleUpdateGarden));
gardenRouter.delete('/:id', asyncHandler(handleDeleteGarden));

module.exports = { gardenRouter };
