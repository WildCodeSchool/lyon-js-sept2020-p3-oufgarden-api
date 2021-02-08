const adminLogin = require("express").Router();
const frontLogin = require("express").Router();
const asyncHandler = require("express-async-handler");
const requireRequestBody = require("../middlewares/requireRequestBody");

const {
  handleLoginAdmin,
  handleLogout,
  handleLoginNormalUser,
} = require("../controllers/login.js");

adminLogin.post("/", requireRequestBody, asyncHandler(handleLoginAdmin));
adminLogin.get("/", asyncHandler(handleLogout));
frontLogin.post("/", requireRequestBody, asyncHandler(handleLoginNormalUser));

module.exports = { adminLogin, frontLogin };
