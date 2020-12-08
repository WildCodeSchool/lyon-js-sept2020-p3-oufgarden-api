const db = require('../db');

const getUsers = async () => {
  return db.query('SELECT * FROM user');
};

module.exports = { getUsers };
