const db = require('../db.js');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');
const { RecordNotFoundError } = require('../error-types');

const findMany = async () => {
  return db.query('SELECT * FROM posts');
};

const findOne = async (id, failIfNotFound = true) => {
  const rows = await db.query(`SELECT * FROM posts WHERE id = ${id}`);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('beer', id);
  return null;
};

const create = async (formData) => {
  return db
    .query(
      `INSERT INTO posts SET ${definedAttributesToSqlSet(formData)}`,
      formData
    )
    .then((res) => findOne(res.insertId));
};

module.exports = { findMany, findOne, create };
