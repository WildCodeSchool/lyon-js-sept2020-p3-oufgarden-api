const {
  getComments,
  getOneComment,
  createComment,
  /* linkArticleToTags,
  linkArticleToGarden, */
  //   updateComment,
  //   removeComment,
} = require('../models/comments.js');

module.exports.handleGetComments = async (req, res) => {
  const rawData = await getComments();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneComment = async (req, res) => {
  res.send(await getOneComment(req.params.id));
};

module.exports.handleCreateComment = async (req, res) => {
  // tagsArray is an array with the IDs of all the tags related to this article
  const { message, article_id, user_id, parent_comment_id } = req.body;
  const data = await createComment({
    message,
    article_id,
    user_id,
    parent_comment_id,
  });

  return res.status(201).send(data);
};

// module.exports.handleUpdateArticle = async (req, res) => {
//   const { title, content, url, updated_at, tagsArray, gardenArray } = req.body;
//   const data = await updateArticle(req.params.id, {
//     title,
//     content,
//     url,
//     updated_at,
//   });

//   const createdArticleId = req.params.id;
//   await linkArticleToTags(createdArticleId, tagsArray);
//   await linkArticleToGarden(createdArticleId, gardenArray);
//   return res.status(200).send(data);
// };

// module.exports.handleDeleteArticle = async (req, res) => {
//   await removeArticle(req.params.id);
//   res.sendStatus(204);
// };
