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
const requireRequestBody = require('../middlewares/requireRequestBody.js');
const requireIsAdmin = require('../middlewares/requireAdmin');

userRouter.get('/', requireIsAdmin, asyncHandler(handleGetUsers));
userRouter.get('/:id', requireIsAdmin, asyncHandler(handleGetOneUser));
userRouter.post(
  '/',
  requireIsAdmin,
  requireRequestBody,
  asyncHandler(handleCreateUser)
);
userRouter.put('/:id', requireIsAdmin, asyncHandler(handleUpdateUser));
userRouter.delete('/:id', requireIsAdmin, asyncHandler(handleDeleteUser));
// test du login

userRouter.post('/', requireIsAdmin, asyncHandler(handleLogin));

module.exports = { userRouter };
