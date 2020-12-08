const db = require('../db');
const { RecordNotFoundError } = require('../error-types');

const getUsers = async () => {
  return db.query('SELECT * FROM user');
};
const getOneUser = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('contacts', id);
  return null;
};

module.exports = { getUsers, getOneUser };
