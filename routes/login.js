const adminLogin = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireRequestBody = require('../middlewares/requireRequestBody');

const { handleLoginAdmin, handleLogout } = require('../controllers/login.js');

adminLogin.post('/', requireRequestBody, asyncHandler(handleLoginAdmin));
adminLogin.get('/', asyncHandler(handleLogout));

module.exports = { adminLogin };
