const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const currentUserController = require('../controllers/currentUser');
const requireCurrentUser = require('../middlewares/requireCurrentUser');

router.get(
  '/',
  requireCurrentUser,
  asyncHandler(currentUserController.handleGetProfile)
);

module.exports = router;
