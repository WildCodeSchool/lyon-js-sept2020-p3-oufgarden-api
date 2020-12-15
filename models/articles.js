const Joi = require('joi');
const db = require('../db');

const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

const getOneArticle = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM article WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('articles', id);
  return null;
};

const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  // eslint-disable-next-line no-unused-vars
  const forUpdate = !!udpatedRessourceId;
  // Creation du schema pour la validation via Joi
  const schema = Joi.object().keys({
    title: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    content: forUpdate ? Joi.string() : Joi.string().required(),
    url: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    created_at: forUpdate ? Joi.any() : Joi.date().required(),
    updated_at: forUpdate ? Joi.date().required() : Joi.any(),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);
};

const validateTags = async (tagsArray) => {
  // here insert validation for number
  const schema = Joi.array().items(Joi.number().integer());
  const { error } = schema.validate(tagsArray, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);

  const rawData = await db.query('SELECT id FROM tag');
  const validIds = rawData.map((obj) => obj.id);
  tagsArray.forEach((idToValidate) => {
    if (validIds.includes(idToValidate) === false) {
      throw new RecordNotFoundError('tag', idToValidate);
    }
  });
};

const linkArticleToTags = async (articleId, tagsArray) => {
  await validateTags(tagsArray);
  let valuePairsString = '';
  tagsArray.forEach((tag) => {
    valuePairsString += `(${+articleId}, ${+tag}),`; // + to convert it to number or make sure it's a number
  });
  valuePairsString = valuePairsString.slice(0, -1); // removing the last comma
  console.log(valuePairsString);
  return db.query(
    `INSERT INTO tagToArticle (article_id, tag_id) VALUES ${valuePairsString};`
  );
  // then(res=> ?)
};

const createArticle = async (newAttributes) => {
  await validate(newAttributes);
  return db
    .query(
      `INSERT INTO article SET ${definedAttributesToSqlSet(newAttributes)}`,
      newAttributes
    )
    .then((res) => getOneArticle(res.insertId));
};

const getArticles = async () => {
  return db.query('SELECT * FROM article');
};

const updateArticle = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const namedAttributes = definedAttributesToSqlSet(newAttributes);
  return db
    .query(`UPDATE article SET ${namedAttributes} WHERE id = :id`, {
      ...newAttributes,
      id,
    })
    .then(() => getOneArticle(id));
};

const removeArticle = async (id, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM article WHERE id = ?', [id]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('article', id);
  return false;
};

module.exports = {
  getArticles,
  getOneArticle,
  createArticle,
  linkArticleToTags,
  updateArticle,
  removeArticle,
};
