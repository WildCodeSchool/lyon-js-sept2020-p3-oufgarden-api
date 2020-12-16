const userRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetUsers,
  handleGetOneUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleLogin,
} = require('../controllers/users');
const protectByApiKey = require('../middlewares/protectByEnvAPIKey');
const requireRequestBody = require('../middlewares/requireRequestBody.js');

userRouter.get('/', asyncHandler(handleGetUsers));
userRouter.get('/:id', asyncHandler(handleGetOneUser));
userRouter.post(
  '/',
  protectByApiKey,
  requireRequestBody,
  asyncHandler(handleCreateUser)
);
userRouter.put(
  '/:id',
  requireRequestBody,
  protectByApiKey,
  asyncHandler(handleUpdateUser)
);
userRouter.delete('/:id', asyncHandler(handleDeleteUser));
// test du login

userRouter.post('/', protectByApiKey, asyncHandler(handleLogin));

module.exports = { userRouter };
