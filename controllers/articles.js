const {
  getArticles,
  getOneArticle,
  createArticle,
  linkArticleToTags,
  updateArticle,
  removeArticle,
} = require('../models/articles.js');

module.exports.handleGetArticles = async (req, res) => {
  const rawData = await getArticles();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneArticle = async (req, res) => {
  res.send(await getOneArticle(req.params.id));
};

module.exports.handleCreateArticle = async (req, res) => {
  // tagsArray is an array with the IDs of all the tags related to this article
  const { title, content, url, created_at, updated_at, tagsArray } = req.body;
  const data = await createArticle({
    title,
    content,
    url,
    created_at,
    updated_at,
  });
  const createdArticleId = data.id;
  await linkArticleToTags(createdArticleId, tagsArray);

  return res.status(201).send(data);
};

module.exports.handleUpdateArticle = async (req, res) => {
  const { title, content, url, created_at, updated_at } = req.body;
  const data = await updateArticle(req.params.id, {
    title,
    content,
    url,
    created_at,
    updated_at,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteArticle = async (req, res) => {
  await removeArticle(req.params.id);
  res.sendStatus(204);
};
