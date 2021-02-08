const {
  getReservations,
  createReservation,
  getGardenReservation,
  getMultipleGardenReservation,
} = require('../models/reservation.js');

module.exports.handleGetReservations = async (req, res) => {
  const rawData = await getReservations();
  return res.status(200).send(rawData);
};

module.exports.handleCreateReservation = async (req, res) => {
  const { garden_id, time_slot_id, reservation_date } = req.body;
  const { id } = req.currentUser;

  const data = await createReservation({
    user_id: id,
    garden_id,
    time_slot_id,
    date: reservation_date,
  });

  return res.status(201).send(data);
};

module.exports.handleGetGardenReservation = async (req, res) => {
  res.send(await getGardenReservation(req.params.id));
};

module.exports.handleGetMultipleGardenReservation = async (req, res) => {
  res.send(await getMultipleGardenReservation(req.params.id));
};
