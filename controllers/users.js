const dayjs = require('dayjs');
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
  linkUserToGarden,
} = require('../models/users.js');

module.exports.handleGetUsers = async (req, res) => {
  const rawData = await getUsers();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneUser = async (req, res) => {
  res.send(await getOneUser(req.params.id));
};

module.exports.handleCreateUser = async (req, res) => {
  const {
    gender_marker,
    birthdate,
    firstname,
    lastname,
    email,
    phone,
    password,
    membership_start,
    is_admin,
    gardenArray,
  } = req.body;

  const user_creation = dayjs().format('YYYY-MM-DD'); // still have to check the format we will want
  const userData = await createUser({
    gender_marker,
    birthdate,
    firstname,
    lastname,
    email,
    phone,
    password,
    membership_start: dayjs(membership_start).format('YYYY-MM-DD'),
    user_creation,
    is_admin: is_admin ? 1 : 0,
  });

  // here, wait to answer and if ok, fill the joining table
  if (!userData) {
    // problem creating the user
    return res.status(424).send('failed to create user');
  }
  await linkUserToGarden(userData.id, gardenArray);

  return res.status(201).send('User and joining table successfully created');
};

module.exports.handleUpdateUser = async (req, res) => {
  const { firstname, lastname, email, password, is_admin } = req.body;
  const data = await updateUser(req.params.id, {
    firstname,
    lastname,
    email,
    password,
    is_admin: is_admin ? 1 : 0,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteUser = async (req, res) => {
  await removeUser(req.params.id);
  res.sendStatus(204);
};
