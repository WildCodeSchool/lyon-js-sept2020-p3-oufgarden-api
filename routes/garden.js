const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const extractCurrentUser = require('../middlewares/extractCurrentUser');
const {
  handleGetGarden,
  handleGetZonesForOneGarden,
  handleGetOneGarden,
  handleCreateGarden,
  handleUpdateGarden,
  handleDeleteGarden,
} = require('../controllers/garden');
const uploadImg = require('../middlewares/handleGardenImageUpload');

gardenRouter.get('/', extractCurrentUser, asyncHandler(handleGetGarden));
gardenRouter.get('/:id', asyncHandler(handleGetOneGarden));

gardenRouter.get('/:id/zones', asyncHandler(handleGetZonesForOneGarden));
gardenRouter.get(
  '/:gardenId/zones/:zoneId/actionFeed',
  asyncHandler(handleGetOneGarden)
);

gardenRouter.post('/', uploadImg, asyncHandler(handleCreateGarden));
gardenRouter.put('/:id', asyncHandler(handleUpdateGarden));
gardenRouter.delete('/:id', asyncHandler(handleDeleteGarden));

module.exports = { gardenRouter };
