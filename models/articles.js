const Joi = require('joi');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const db = require('../db');
require('dotenv').config();

const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

const getArticles = async () => {
  return db.query('SELECT * FROM article ORDER BY created_at DESC');
};

const getAllFavorites = async () => {
  return db.query(
    'SELECT fav.*, article.title AS article_title, article.url AS article_url, user.firstname AS user_firstname, user.lastname AS user_lastname FROM favorite AS fav INNER JOIN article ON fav.article_id = article.id INNER JOIN user ON fav.user_id = user.id ORDER BY article_id ASC'
  );
};

const getFavorites = async (user_id) => {
  return db.query(
    'SELECT fav.*, article.title AS article_title, article.url AS article_url, user.firstname AS user_firstname, user.lastname AS user_lastname FROM favorite AS fav INNER JOIN article ON fav.article_id = article.id INNER JOIN user ON fav.user_id = user.id WHERE fav.user_id=? ORDER BY article_id ASC',
    [user_id]
  );
};

const getFeed = async (gardenIdConcat) => {
  return db.query(
    'SELECT A.* FROM article AS A INNER JOIN articleToGarden AS ATG ON A.id = ATG.article_id WHERE ATG.garden_id IN (?) ORDER BY created_at DESC',
    [gardenIdConcat]
  );
};

const getOneArticle = async (id, failIfNotFound = true) => {
  const rows = await db.query('select * from article where id = ?', [id]);
  const tagsRows = await db.query(
    'SELECT * FROM tagToArticle AS TTA JOIN article AS A ON TTA.article_id=A.id JOIN tag AS T ON TTA.tag_id=T.id WHERE A.id= ?',
    [id]
  );
  const gardenRows = await db.query(
    'SELECT G.name, ATG.garden_id FROM articleToGarden as ATG JOIN garden AS G ON ATG.garden_id=G.id JOIN article AS A ON ATG.article_id=A.id WHERE A.id = ?',
    [id]
  );
  console.log(gardenRows, tagsRows);
  if (tagsRows.length || gardenRows.length) {
    const tagGardenRows = {
      tag: tagsRows,
      garden: gardenRows,
      row: rows[0],
    };
    return tagGardenRows;
  }
  if (tagsRows.length < 1 && gardenRows < 1) {
    return { row: rows[0] };
  }
  if (failIfNotFound) {
    throw new RecordNotFoundError('articles', id);
  }
  return null;
};

const removeArticle = async (id, failIfNotFound = true) => {
  if (id) {
    const res = await db.query('DELETE FROM article WHERE id = ?', [id]);
    if (res.affectedRows !== 0) {
      return true;
    }
    if (failIfNotFound) throw new RecordNotFoundError('article', id);
    return false;
  }
  return null;
};

const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;

  const schema = Joi.object().keys({
    title: forUpdate
      ? Joi.string().allow('').allow(null)
      : Joi.string().min(0).max(150).required(),
    content: forUpdate
      ? Joi.string().allow('').allow(null)
      : Joi.string().required(),
    url: forUpdate
      ? Joi.string().allow('').allow(null)
      : Joi.string().min(0).max(150).allow(' ').allow(null),
    updated_at: forUpdate ? Joi.date().required() : Joi.any(),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);
};

// this whole function returns either true or false depending on whether the data is ok or not
const validateTags = async (tagsArray) => {
  let validation = true;
  const schema = Joi.array().items(
    Joi.number().integer().allow('').allow(null)
  );
  const { error } = schema.validate(tagsArray, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);

  const rawData = await db.query('SELECT id FROM tag');
  const validIds = rawData.map((obj) => obj.id);
  tagsArray.forEach((idToValidate) => {
    if (validIds.includes(idToValidate) === false) {
      validation = false;
    }
  });

  return validation;
};

const validateFavorite = async (attributes) => {
  console.log(attributes);
  let validation = true;
  const { user_id, article_id } = attributes;

  const schema = Joi.object().keys({
    user_id: Joi.number().integer().required(),
    article_id: Joi.number().integer().required(),
  });
  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);

  const rawDataUser = await db.query('SELECT id FROM user');
  const validIdsUser = rawDataUser.map((obj) => obj.id);

  const rawDataArticle = await db.query('SELECT id FROM article');
  const validIdsArticle = rawDataArticle.map((obj) => obj.id);
  if (validIdsUser.includes(user_id) === false) {
    validation = false;
  }
  if (validIdsArticle.includes(+article_id) === false) {
    validation = false;
  }

  return validation;
};

// eslint-disable-next-line consistent-return
const linkArticleToTags = async (articleId, tagsArray) => {
  await db.query('DELETE from tagToArticle WHERE article_id = ?', [articleId]);
  if (tagsArray.length > 0) {
    const tagValidation = await validateTags(tagsArray);
    let valuePairsString = '';
    tagsArray.forEach((tag) => {
      valuePairsString += `(${+articleId}, ${+tag}),`; // + to convert it to number or make sure it's a number
    });
    valuePairsString = valuePairsString.slice(0, -1); // removing the last comma

    const result = await db
      .query(
        `INSERT INTO tagToArticle (article_id, tag_id) VALUES ${valuePairsString};`
      )
      .catch((err) => {
        console.log(err);
      });
    if (!tagValidation || result === false) {
      removeArticle(articleId);
      throw new ValidationError([
        {
          message:
            'there was a problem to link the article to its tags, the article was removed',
          path: ['tagToArticle'],
          type: 'insertionError',
        },
      ]);
    }
  } else {
    return db.query('DELETE from tagToArticle WHERE article_id = ?', [
      articleId,
    ]);
  }
};

const validateGarden = async (gardenArray) => {
  let validation = true;
  const schema = Joi.array().items(Joi.number().integer());
  const { error } = schema.validate(gardenArray, {
    abortEarly: false,
  });

  if (error) throw new ValidationError(error.details);

  const rawData = await db.query('SELECT id FROM garden');
  const validIds = rawData.map((obj) => obj.id);
  gardenArray.forEach((idToValidate) => {
    if (validIds.includes(idToValidate) === false) {
      validation = false;
      // throw new RecordNotFoundError('tag', idToValidate);
    }
  });

  return validation;
};
const linkArticleToGarden = async (articleId, gardenArray) => {
  await db.query('DELETE from articleToGarden WHERE article_id = ?', [
    articleId,
  ]);
  if (gardenArray.length > 0) {
    const gardenValidation = await validateGarden(gardenArray);
    let valuePairsString = '';
    gardenArray.forEach((elem) => {
      valuePairsString += `(${+articleId}, ${+elem}),`; // + to convert it to number or make sure it's a number
    });
    valuePairsString = valuePairsString.slice(0, -1); // removing the last comma

    const result = await db
      .query(
        `INSERT INTO articleToGarden (article_id, garden_id) VALUES ${valuePairsString};`
      )
      .catch((err) => {
        console.log(err);
      });

    if (!gardenValidation || result === false) {
      removeArticle(articleId);
      throw new ValidationError([
        {
          message:
            'there was a problem to link the article to its tags, the article was removed',
          path: ['gardenToArticle'],
          type: 'insertionError',
        },
      ]);
    }
  }
};

const createArticle = async (newAttributes) => {
  await validate(newAttributes);
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return db
    .query(
      `INSERT INTO article SET ${definedAttributesToSqlSet(
        newAttributes
      )}, created_at=:date`,
      { ...newAttributes, date }
    )
    .then((res) => getOneArticle(res.insertId));
};

const createFavorite = async (newAttributes) => {
  const validation = await validateFavorite(newAttributes);
  const { user_id } = newAttributes;
  if (validation === false) {
    throw new ValidationError([
      {
        message:
          'there is no such article, or no such user (an id does not exist)',
        path: ['favorite'],
        type: 'insertionError',
      },
    ]);
  }
  return db
    .query(
      `INSERT INTO favorite SET ${definedAttributesToSqlSet(newAttributes)}`,
      { ...newAttributes }
    )
    .then(() => getFavorites(user_id));
};

const updateArticle = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const namedAttributes = definedAttributesToSqlSet(newAttributes);
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return db
    .query(
      `UPDATE article SET ${namedAttributes}, updated_at=:date WHERE id = :id`,
      {
        ...newAttributes,
        date,
        id,
      }
    )
    .then(() => getOneArticle(id));
};

const removeFavorite = async ({ user_id, id }, failIfNotFound = true) => {
  if (user_id && id) {
    const res = await db.query(
      'DELETE FROM favorite WHERE user_id=? AND article_id=?',
      [user_id, id]
    );
    if (res.affectedRows !== 0) {
      return true;
    }
    if (failIfNotFound) throw new RecordNotFoundError('favorite', user_id);
    return false;
  }
  return null;
};

module.exports = {
  getArticles,
  getAllFavorites,
  getOneArticle,
  createArticle,
  linkArticleToTags,
  linkArticleToGarden,
  updateArticle,
  removeArticle,
  getFavorites,
  createFavorite,
  removeFavorite,
  getFeed,
};
