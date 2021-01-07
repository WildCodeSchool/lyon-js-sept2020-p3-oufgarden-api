const adminLogin = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireRequestBody = require('../middlewares/requireRequestBody');

const { handleLogin, handleLogout } = require('../controllers/login.js');

adminLogin.post('/', requireRequestBody, asyncHandler(handleLogin));
adminLogin.get('/', asyncHandler(handleLogout));

module.exports = { adminLogin };
