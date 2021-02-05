const { getTimeSlots } = require("../models/timeSlots.js");

module.exports.handleGetTimeSlots = async (req, res) => {
  const rawData = await getTimeSlots();
  return res.status(200).send(rawData);
};
