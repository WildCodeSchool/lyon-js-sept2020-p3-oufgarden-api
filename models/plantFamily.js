const db = require("../db");

const getPlantFamily = async () => {
  return db.query("SELECT * FROM plantFamily");
};

module.exports = {
  getPlantFamily,
};
