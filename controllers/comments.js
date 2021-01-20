// const { removeArticle } = require('../models/articles.js');
const {
  getComments,
  getOneComment,
  createComment,
  updateComment,
  removeComment,
} = require('../models/comments.js');

module.exports.handleGetComments = async (req, res) => {
  const { article_id } = req.query;
  const rawData = await getComments(article_id);
  return res.status(200).send(rawData);
};

module.exports.handleGetOneComment = async (req, res) => {
  res.send(await getOneComment(req.params.id));
};

module.exports.handleCreateComment = async (req, res) => {
  // tagsArray is an array with the IDs of all the tags related to this article
  const { message, article_id } = req.body;
  console.log(req.currentUser);
  const data = await createComment({
    message,
    article_id,
    user_id: req.currentUser.id,
    parent_comment_id: null,
  });

  return res.status(201).send(data);
};

module.exports.handleUpdateComment = async (req, res) => {
  const { message } = req.body; // only the message can be updated in a comment
  const data = await updateComment(req.params.id, {
    message,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteComment = async (req, res) => {
  await removeComment(req.params.id);
  res.sendStatus(204);
};
