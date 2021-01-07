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
  // {
  //   "gender": "monsieur",
  //   "lastname": "Blanc",
  //   "firstname": "Jules",
  //   "birthdate": "1999-12-12",
  //   "membership_start": "2021-01-01",
  //   "email": "manu-macron@gmail.com",
  //   "emailConfirmation": "manu-macron@gmail.com",
  //   "phone": "0789876655",
  //   "password": "9uI5pbY7",
  //   "is_admin": false,
  //   "gardenArray": [
  //     27,
  //     28
  //   ]
  // }
  const {
    gender,
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
  // here, still have to handle data validation

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
    is_admin: is_admin ? 1 : 0,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteUser = async (req, res) => {
  await removeUser(req.params.id);
  res.sendStatus(204);
};
