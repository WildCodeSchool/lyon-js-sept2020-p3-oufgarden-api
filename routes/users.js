const userRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const {
  handleGetUsers,
  handleGetOneUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} = require('../controllers/users');

userRouter.get('/', asyncHandler(handleGetUsers));
userRouter.get('/:id', asyncHandler(handleGetOneUser));
userRouter.post('/', asyncHandler(handleCreateUser));
userRouter.put('/:id', asyncHandler(handleUpdateUser));
userRouter.delete('/:id', asyncHandler(handleDeleteUser));

module.exports = { userRouter };
