const {
  getArticles,
  getOneArticle,
  createArticle,
  linkArticleToTags,
  linkArticleToGarden,
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
  const url = req.file ? req.file.path : null;
  // tagsArray is an array with the IDs of all the tags related to this article
  const { title, content, tagsArray, gardenArray } = JSON.parse(req.body.data);
  const data = await createArticle({
    title,
    content,
    url,
    // created_at,
    // updated_at,
  });
  const createdArticleId = data.id;
  await linkArticleToTags(createdArticleId, tagsArray);
  await linkArticleToGarden(createdArticleId, gardenArray);
  return res.status(201).send(data);
};

module.exports.handleUpdateArticle = async (req, res) => {
  const url = req.file ? req.file.path : null;
  const { title, content, updated_at, tagsArray, gardenArray } = req.body;
  const data = await updateArticle(req.params.id, {
    title,
    content,
    url,
    updated_at,
  });

  const createdArticleId = req.params.id;
  await linkArticleToTags(createdArticleId, tagsArray);
  await linkArticleToGarden(createdArticleId, gardenArray);
  return res.status(200).send(data);
};

module.exports.handleDeleteArticle = async (req, res) => {
  await removeArticle(req.params.id);
  res.sendStatus(204);
};
