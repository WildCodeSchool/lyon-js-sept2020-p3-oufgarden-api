const router = require('express').Router();
// const asyncHandler = require('express-async-handler');
// const currentUserController = require('../controllers/currentUser');
const extractCurrentUser = require('../middlewares/extractCurrentUser');

router.get(
  '/',
  extractCurrentUser
  // asyncHandler(currentUserController.handleGetProfile)
);

module.exports = router;
