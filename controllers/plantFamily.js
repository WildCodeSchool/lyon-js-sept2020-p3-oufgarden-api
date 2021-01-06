const { getPlantFamily } = require('../models/plantFamily.js');

module.exports.handleGetPlantFamily = async (req, res) => {
  const rawData = await getPlantFamily();
  return res.status(200).send(rawData);
};
