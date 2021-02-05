const {
  getActions,
  getOneAction,
  createAction,
  updateAction,
  removeAction,
} = require("../models/actions.js");

module.exports.handleGetActions = async (req, res) => {
  const rawData = await getActions();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneAction = async (req, res) => {
  res.send(await getOneAction(req.params.id));
};

module.exports.handleCreateAction = async (req, res) => {
  const { name } = req.body;
  const data = await createAction({
    name,
  });
  return res.status(201).send(data);
};

module.exports.handleUpdateAction = async (req, res) => {
  const { name } = req.body;
  const data = await updateAction(req.params.id, {
    name,
  });
  return res.status(200).send(data);
};

module.exports.handleDeleteAction = async (req, res) => {
  await removeAction(req.params.id);
  res.sendStatus(204);
};
