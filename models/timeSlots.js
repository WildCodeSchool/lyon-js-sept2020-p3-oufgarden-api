const db = require("../db");

const getTimeSlots = async () => {
  return db.query("SELECT * FROM time_slot");
};

module.exports = {
  getTimeSlots,
};
