const dayjs = require('dayjs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
  linkUserToGarden,
} = require('../models/users.js');

module.exports.handleGetUsers = async (_req, res) => {
  const rawData = await getUsers();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneUser = async (req, res) => {
  res.send(await getOneUser(req.params.id));
};

module.exports.handleCreateUser = async (req, res) => {
  const picture_url = req.file ? req.file.path : null;
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
  } = JSON.parse(req.body.data);

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
    picture_url,
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
    // host: 'smtp.gmail.com', // e.g. smtp.gmail.com
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(transport);

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log(success);
      console.log('All works fine, congrats!');
    }
  });

  const mail = {
    from: `"OufGarden" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Bienvenue chez OUF !',

    html: `<p>Votre compte adhérent chez OUF a bien été créé ! <br/> Vous pouvez y accéder en utilisant votre adresse mail, ainsi que le mot de passe : ${password}</>`,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log('fail sending user creation email');
    } else {
      console.log('success sending user creation email');
      console.log(data);
    }
  });

  return res.status(201).send('User and joining table successfully created');
};

module.exports.handleUpdateUser = async (req, res) => {
  let picture_url;
  if (req.file) {
    picture_url = req.file.path;
  }
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
  } = JSON.parse(req.body.data);

  let is_admin_database;
  if (is_admin === undefined) {
    is_admin_database = undefined;
  } else if (is_admin === true) {
    is_admin_database = 1;
  } else if (is_admin === false) {
    is_admin_database = 0;
  }

  const userData = await updateUser(req.params.id, {
    gender_marker,
    birthdate,
    firstname,
    lastname,
    email,
    phone,
    password,
    picture_url,
    membership_start,
    is_admin: is_admin_database,
  });
  // here, wait to answer and if ok, fill the joining table
  if (!userData) {
    // problem creating the user
    return res.status(424).send('failed to create user');
  }

  if (gardenArray) {
    await linkUserToGarden(userData.id, gardenArray, true);
  }

  return res.status(201).send(userData);
};

module.exports.handleDeleteUser = async (req, res) => {
  await removeUser(req.params.id);
  res.sendStatus(204);
};
