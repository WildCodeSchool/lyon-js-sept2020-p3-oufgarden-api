const adminLogin = require('express').Router();
const asyncHandler = require('express-async-handler');

const { handleLogin } = require('../controllers/loginBO.js');

adminLogin.post('/', asyncHandler(handleLogin));

module.exports = { adminLogin };
