const Joi = require("joi");
const dayjs = require("dayjs");

const db = require("../db");
require("dotenv").config();

const { RecordNotFoundError, ValidationError } = require("../error-types");
const definedAttributesToSqlSet = require("../helpers/definedAttributesToSQLSet.js");

const getComments = async (article_id) => {
  // it is possible to filter comments by article id
  // 'get/comments?article_id=12'
  const filterArray = [];
  let query =
    "SELECT comment.*, user.picture_url, user.lastname, user.firstname FROM comment INNER JOIN user ON user.id= comment.user_id";
  if (article_id) {
    query += ` WHERE comment.article_id= ?`;
    filterArray.push(article_id);
  }

  query += " ORDER BY date DESC;";

  return db.query(query, filterArray);
};

const getOneComment = async (id, failIfNotFound = true) => {
  const rows = await db.query("SELECT * FROM comment where id = ?", [id]);

  if (rows.length > 0) {
    return rows[0];
  }
  if (failIfNotFound) {
    throw new RecordNotFoundError("comments", id);
  }
  return null;
};

const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;

  const schema = Joi.object().keys({
    message: forUpdate
      ? Joi.string().allow("").allow(null)
      : Joi.string().required(),
    article_id: forUpdate
      ? Joi.number().integer()
      : Joi.number().integer().required(),
    user_id: forUpdate
      ? Joi.number().integer()
      : Joi.number().integer().required(),
    parent_comment_id: Joi.number().integer().allow(null),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);
};

const createComment = async (newAttributes) => {
  await validate(newAttributes);
  const date = dayjs().format("YYYY-MM-DD HH:mm:ss");

  return db
    .query(
      `INSERT INTO comment SET ${definedAttributesToSqlSet(
        newAttributes
      )}, date=:date`,
      { ...newAttributes, date }
    )
    .then((res) => getOneComment(res.insertId));
};

const updateComment = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const { message } = newAttributes;
  const date = dayjs().format("YYYY-MM-DD HH:mm:ss");

  return db
    .query(`UPDATE comment SET message=:message, date=:date WHERE id = :id`, {
      message,
      date,
      id,
    })
    .then(() => getOneComment(id));
};

const removeComment = async (id, failIfNotFound = true) => {
  if (id) {
    const res = await db.query("DELETE FROM comment WHERE id = ?", [id]);
    if (res.affectedRows !== 0) {
      return true;
    }
    if (failIfNotFound) throw new RecordNotFoundError("comment", id);
    return false;
  }
  return null;
};

module.exports = {
  getComments,
  getOneComment,
  createComment,
  updateComment,
  removeComment,
};
