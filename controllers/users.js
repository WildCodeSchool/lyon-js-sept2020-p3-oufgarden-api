const { getUsers, getOneUser } = require('../models/users.js');

module.exports.handleGetUsers = async (req, res) => {
  const rawData = await getUsers();
  return res.status(200).send(
    rawData.map((e) => ({
      id: e.id,
      firstname: e.firstname,
      lastname: e.lastname,
      email: e.email,
      ad: e.is_admin,
    }))
  );
};

module.exports.handleGetOneUser = async (req, res) => {
  res.send(await getOneUser(req.params.id));
};
