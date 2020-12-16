const db = require('../db');

const getTagToArticle = async () => {
  return db.query('SELECT * FROM tagToArticle');
};

module.exports = {
  getTagToArticle,
};
