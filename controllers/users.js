const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
} = require('../models/users.js');

module.exports.handleGetUsers = async (req, res) => {
  const rawData = await getUsers();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneUser = async (req, res) => {
  res.send(await getOneUser(req.params.id));
};

module.exports.handleCreateUser = async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, password, is_admin } = req.body;
  const data = await createUser({
    firstname,
    lastname,
    email,
    password,
    is_admin: is_admin ? 1 : 0,
  });
  return res.status(201).send(data);
};

module.exports.handleUpdateUser = async (req, res) => {
  const { firstname, lastname, email, password, is_admin } = req.body;
  const data = await updateUser(req.params.id, {
    firstname,
    lastname,
    email,
    password,
    is_admin,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteUser = async (req, res) => {
  await removeUser(req.params.id);
  res.sendStatus(204);
};
