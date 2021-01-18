const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
  linkUserToGarden,
} = require('../models/users.js');
const creds = require('../mailConfig');

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

  // sending an email with user infos
  const transport = {
    host: 'smtp.gmail.com', // e.g. smtp.gmail.com
    auth: {
      user: creds.USER,
      pass: creds.PASS,
    },
  };

  const transporter = nodemailer.createTransport(transport);

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('All works fine, congrats!');
    }
  });

  const mail = {
    from: `"OufGarden" <${creds.USER}>`,
    to: email,
    subject: 'Bienvenue chez OufGarden !',

    html: `<p>Votre compte adhérent chez OufGarden a bien été créé ! <br/> Vous pouvez y accéder en utilisant votre adresse mail, ainsi que le mot de passe : ${password}</>`,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log('fail sending user creation email');
    } else {
      console.log('success sending user creation email');
    }
  });

  return res.status(201).send('User and joining table successfully created');
};

module.exports.handleUpdateUser = async (req, res) => {
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

  const userData = await updateUser(req.params.id, {
    gender_marker,
    birthdate,
    firstname,
    lastname,
    email,
    phone,
    password,
    membership_start,
    is_admin: is_admin ? 1 : 0,
  });
  // here, wait to answer and if ok, fill the joining table
  if (!userData) {
    // problem creating the user
    return res.status(424).send('failed to create user');
  }
  await linkUserToGarden(userData.id, gardenArray, true);

  return res.status(201).send('User and joining table successfully created');
};

module.exports.handleDeleteUser = async (req, res) => {
  await removeUser(req.params.id);
  res.sendStatus(204);
};
