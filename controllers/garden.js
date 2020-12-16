const {
  getGardens,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
} = require('../models/garden.js');

module.exports.handleGetGardens = async (req, res) => {
  const rawData = await getGardens();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneGarden = async (req, res) => {
  res.send(await getOneGarden(req.params.id));
};

module.exports.handleCreateGarden = async (req, res) => {
  const { name } = req.body;
  const data = await createGarden({
    name,
  });
  return res.status(201).send(data);
};

module.exports.handleUpdateGarden = async (req, res) => {
  const { name } = req.body;
  const data = await updateGarden(req.params.id, {
    name,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteGarden = async (req, res) => {
  await removeGarden(req.params.id);
  res.sendStatus(204);
};

// partie upload

/* const { findMany, findOne, create } = require('../models/garden');

module.exports.getCollection = async (req, res) => {
  const posts = await findMany();
  res.send(posts);
};

module.exports.findOne = async (req, res) => {
  res.send(await findOne(req.params.id));
};

module.exports.handleGarden = async (req, res) => {
  const { name } = req.body;
  const main_picture_url = req.file ? req.file.path : null;
  const createdpost = await create({ name, main_picture_url });
  res.status(201).send(createdpost);
}; */
