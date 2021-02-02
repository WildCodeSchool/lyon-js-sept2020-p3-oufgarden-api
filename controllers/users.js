const dayjs = require("dayjs");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
  linkUserToGarden,
} = require("../models/users.js");
const { AUTH_EMAIL_ID,
  AUTH_EMAIL_SECRET,
    AUTH_EMAIL_REFRESH_TOKEN } = require("../env");

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

  const user_creation = dayjs().format("YYYY-MM-DD"); // still have to check the format we will want
  const userData = await createUser({
    gender_marker,
    birthdate,
    firstname,
    lastname,
    email,
    phone,
    password,
    membership_start: dayjs(membership_start).format("YYYY-MM-DD"),
    user_creation,
    picture_url,
    is_admin: is_admin ? 1 : 0,
  });

  // here, wait to answer and if ok, fill the joining table
  if (!userData) {
    // problem creating the user
    return res.status(424).send("failed to create user");
  }
  await linkUserToGarden(userData.id, gardenArray);

  console.log(AUTH_EMAIL_ID,
  AUTH_EMAIL_SECRET,
    AUTH_EMAIL_REFRESH_TOKEN);

  const myOAuth2Client = new OAuth2(AUTH_EMAIL_ID, AUTH_EMAIL_SECRET,"https://developers.google.com/oauthplayground");

  myOAuth2Client.setCredentials({refresh_token:AUTH_EMAIL_REFRESH_TOKEN});

  const myAccessToken = myOAuth2Client.getAccessToken()

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "teamoufgarden@gmail.com", //your gmail account you used to set the project up in google cloud console"
         clientId: AUTH_EMAIL_ID,
         clientSecret: AUTH_EMAIL_SECRET,
         refreshToken: AUTH_EMAIL_REFRESH_TOKEN,
         accessToken: myAccessToken //access token variable we defined earlier
    }});

    const mailOptions = {
      from: 'teamoufgarden@gmail.com', // sender
      to: email, // receiver
      subject: 'Bienvenue chez OUF !', // Subject
      html: `<p>Votre compte adhérent chez OUF a bien été créé ! <br/> Vous pouvez y accéder en utilisant votre adresse mail, ainsi que le mot de passe : ${password}</p>`// html body
      }

    transport.sendMail(mailOptions, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        transport.close();
        console.log("Email has been sent: check your inbox!");
      }
  });
 
  
  return res.status(201).send("User and joining table successfully created");
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
    return res.status(424).send("failed to create user");
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
