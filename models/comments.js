const Joi = require('joi');
const dayjs = require('dayjs');

const db = require('../db');
require('dotenv').config();

const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

const getComments = async () => {
  return db.query('SELECT * FROM comment ORDER BY date DESC');
};

const getOneComment = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM comment where id = ?', [id]);

  if (rows.length > 0) {
    return rows[0];
  }
  if (failIfNotFound) {
    throw new RecordNotFoundError('comments', id);
  }
  return null;
};

const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;

  const schema = Joi.object().keys({
    message: forUpdate
      ? Joi.string().allow('').allow(null)
      : Joi.string().required(),
    article_id: forUpdate
      ? Joi.number().integer()
      : Joi.number().integer().required(),
    user_id: forUpdate
      ? Joi.number().integer()
      : Joi.number().integer().required(),
    parent_comment_id: Joi.number().integer(),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);
};

const createComment = async (newAttributes) => {
  await validate(newAttributes);
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return db
    .query(
      `INSERT INTO comment SET ${definedAttributesToSqlSet(
        newAttributes
      )}, date=:date`,
      { ...newAttributes, date }
    )
    .then((res) => getOneComment(res.insertId));
};

module.exports = {
  getComments,
  getOneComment,
  createComment,
  // linkArticleToTags,
  // linkArticleToGarden,
  // updateArticle,
  // removeArticle,
};
