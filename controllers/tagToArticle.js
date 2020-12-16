const { getTagToArticle } = require('../models/tagToArticle.js');

module.exports.handleGetTagToArticle = async (req, res) => {
  const rawData = await getTagToArticle();
  return res.status(200).send(rawData);
};
