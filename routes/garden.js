const gardenRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const extractCurrentUser = require('../middlewares/extractCurrentUser');
const {
  handleGetGarden,
  handleGetZonesForOneGarden,
  handleUpdateZones,
  handleGetActionFeedForOneZone,
  handlePostActionFeedForOneZone,
  handleGetActionFeedForOneGarden,
  handleGetOneGarden,
  handleCreateGarden,
  handleUpdateGarden,
  handleDeleteGarden,
} = require('../controllers/garden');
const uploadImg = require('../middlewares/handleGardenImageUpload');

gardenRouter.get(
  '/:gardenId/zones/:zoneId/actionFeed',
  extractCurrentUser,
  asyncHandler(handleGetActionFeedForOneZone)
);
gardenRouter.get(
  '/:gardenId/actionFeed',
  extractCurrentUser,
  asyncHandler(handleGetActionFeedForOneGarden)
);
gardenRouter.post(
  '/:gardenId/zones/:zoneId/actionFeed',
  extractCurrentUser,
  asyncHandler(handlePostActionFeedForOneZone)
);

gardenRouter.get('/', extractCurrentUser, asyncHandler(handleGetGarden));
gardenRouter.get('/:id', asyncHandler(handleGetOneGarden));

gardenRouter.get(
  '/:id/zones',
  extractCurrentUser,
  asyncHandler(handleGetZonesForOneGarden)
);
gardenRouter.post('/:id/zones', asyncHandler(handleUpdateZones));

gardenRouter.post('/', uploadImg, asyncHandler(handleCreateGarden));
gardenRouter.put('/:id', uploadImg, asyncHandler(handleUpdateGarden));
gardenRouter.delete('/:id', asyncHandler(handleDeleteGarden));

module.exports = { gardenRouter };
