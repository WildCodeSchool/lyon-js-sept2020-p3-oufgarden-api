const userRouter = require('express').Router();
const { handleGetUsers } = require('../controllers/users');

userRouter.get('/', handleGetUsers);

module.exports = { userRouter };
