const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const extractCurrentUser = require('../middlewares/extractCurrentUser');
const {
  handleGetGarden,
  handleGetOneGarden,
  handleCreateGarden,
  handleUpdateGarden,
  handleDeleteGarden,
} = require('../controllers/garden');
const uploadImg = require('../middlewares/handleGardenImageUpload');

gardenRouter.get('/', extractCurrentUser, asyncHandler(handleGetGarden));
gardenRouter.get('/:id', asyncHandler(handleGetOneGarden));
gardenRouter.post('/', uploadImg, asyncHandler(handleCreateGarden));
gardenRouter.put('/:id', uploadImg, asyncHandler(handleUpdateGarden));
gardenRouter.delete('/:id', asyncHandler(handleDeleteGarden));

module.exports = { gardenRouter };
