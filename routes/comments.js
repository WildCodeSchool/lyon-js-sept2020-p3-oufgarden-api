const commentRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const extractCurrentUser = require("../middlewares/extractCurrentUser");

const {
  handleGetComments,
  handleGetOneComment,
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
} = require("../controllers/comments");

commentRouter.get("/", extractCurrentUser, asyncHandler(handleGetComments));
commentRouter.get(
  "/:id",
  extractCurrentUser,
  asyncHandler(handleGetOneComment)
);
commentRouter.post("/", extractCurrentUser, asyncHandler(handleCreateComment));
commentRouter.put(
  "/:id",
  extractCurrentUser,
  asyncHandler(handleUpdateComment)
);
commentRouter.delete(
  "/:id",
  extractCurrentUser,
  asyncHandler(handleDeleteComment)
);
// you will need to be admin to delete a comment

module.exports = { commentRouter };
