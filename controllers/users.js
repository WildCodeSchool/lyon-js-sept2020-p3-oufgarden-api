const { getUsers } = require('../models/users');

module.exports.handleGetUsers = async (req, res) => {
  const rawData = await getUsers();
  return res.status(201).send(rawData);
};
