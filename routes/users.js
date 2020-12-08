const userRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const { handleGetUsers, handleGetOneUser } = require('../controllers/users');

userRouter.get('/', asyncHandler(handleGetUsers));
userRouter.get('/:id', asyncHandler(handleGetOneUser));

module.exports = { userRouter };
