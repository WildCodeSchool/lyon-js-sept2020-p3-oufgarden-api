const adminLogin = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireRequestBody = require('../middlewares/requireRequestBody');
const requireAdmin = require('../middlewares/requireAdmin');

const { handleLogin, handleLogout } = require('../controllers/loginBO.js');

adminLogin.post(
  '/',
  requireAdmin,
  requireRequestBody,
  asyncHandler(handleLogin)
);
adminLogin.get('/', asyncHandler(handleLogout));

module.exports = { adminLogin };
