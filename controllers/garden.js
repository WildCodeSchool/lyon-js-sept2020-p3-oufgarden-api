const {
  getGarden,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
} = require('../models/garden');

module.exports.handleGetGarden = async (req, res) => {
  const rawData = await getGarden();
  return res.status(200).send(rawData);
};

module.exports.handleGetOneGarden = async (req, res) => {
  res.send(await getOneGarden(req.params.id));
};

module.exports.handleCreateGarden = async (req, res) => {
  const { name, description, exposition, address, zone_number } = req.body;
  const data = await createGarden({
    name,
    description,
    exposition,
    address,
    zone_number,
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
