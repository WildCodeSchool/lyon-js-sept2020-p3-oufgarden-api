const {
  getArticles,
  getOneArticle,
  createArticle,
  linkArticleToTags,
  linkArticleToGarden,
  updateArticle,
  removeArticle,
  getFavorites,
  getAllFavorites,
  createFavorite,
  removeFavorite,
  getFeed,
} = require('../models/articles.js');

module.exports.handleGetArticles = async (req, res) => {
  if (req.currentUser.is_admin === 1) {
    const rawData = await getArticles();
    return res.status(200).send(rawData);
  }
  const rawData = await getFeed(req.currentUser.garden_id_concat);
  return res.status(200).send(rawData);
};

module.exports.handleGetFavorites = async (req, res) => {
  // const { user_id } = req.query; user_id sould not come frome the req.query and should be of the current user
  if (req.currentUser.is_admin === 1) {
    const rawData = await getAllFavorites();
    return res.status(200).send(rawData);
  }
  const rawData = await getFavorites(req.currentUser.id);
  return res.status(200).send(rawData);
};

module.exports.handleGetOneArticle = async (req, res) => {
  res.send(await getOneArticle(req.params.id));
};

module.exports.handleCreateArticle = async (req, res) => {
  let url;
  if (!req.file) {
    url = null;
  } else {
    url = req.file.path;
  }
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

module.exports.handleCreateFavorite = async (req, res) => {
  const { user_id, article_id } = req.body;
  const data = await createFavorite({
    user_id,
    article_id,
  });
  return res.status(201).send(data);
};

module.exports.handleUpdateArticle = async (req, res) => {
  let url;
  if (req.file) {
    url = req.file.path;
  }
  const { title, content, updated_at, tagsArray, gardenArray } = JSON.parse(
    req.body.data
  );
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

module.exports.handleDeleteFavorite = async (req, res) => {
  const { user_id, article_id } = req.body;
  const removed = await removeFavorite({ user_id, article_id });
  if (!removed) {
    res
      .status(422)
      .send(
        'error deleting favorite, check that you send a correct user AND article id'
      );
  }

  res.sendStatus(204);
};
