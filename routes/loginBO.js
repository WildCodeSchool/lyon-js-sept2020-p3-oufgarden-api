const adminLogin = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireRequestBody = require('../middlewares/requireRequestBody');

const { handleLogin } = require('../controllers/loginBO.js');

adminLogin.post('/', requireRequestBody, asyncHandler(handleLogin));
/* adminLogin.get('/', asyncHandler(handleLogout)); */

module.exports = { adminLogin };
