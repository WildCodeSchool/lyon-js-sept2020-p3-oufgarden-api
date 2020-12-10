const {
  getArticles,
  getOneArticle,
  createArticle,
  // updateUser,
  // removeUser,
} = require('../models/articles.js');

module.exports.handleGetArticles = async (req, res) => {
  const rawData = await getArticles();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneArticle = async (req, res) => {
  res.send(await getOneArticle(req.params.id));
};

module.exports.handleCreateArticle = async (req, res) => {
  const { title, content, url, date } = req.body;
  const data = await createArticle({
    title,
    content,
    url,
    created_at: date,
  });
  return res.status(201).send(data);
};

//   module.exports.handleUpdateUser = async (req, res) => {
//     const { firstname, lastname, email, password, is_admin } = req.body;
//     const data = await updateUser(req.params.id, {
//       firstname,
//       lastname,
//       email,
//       password,
//       is_admin,
//     });
//     return res.status(200).send(data);
//   };

//   module.exports.handleDeleteUser = async (req, res) => {
//     await removeUser(req.params.id);
//     res.sendStatus(204);
//   };
