const tagToArticleRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const { handleGetTagToArticle } = require("../controllers/tagToArticle");

tagToArticleRouter.get("/", asyncHandler(handleGetTagToArticle));

module.exports = { tagToArticleRouter };
