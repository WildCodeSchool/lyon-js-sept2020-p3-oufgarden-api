const {
  getReservations,
  createReservation,
  getGardenReservation,
  /*  createReservation, */
  // getOneTag,
  // createTag,
  // updateTag,
  // removeTag,
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
  console.log(req.params.id);
  res.send(await getGardenReservation(req.params.id));
};
//     res.send(await getOneTag(req.params.id));
//   };

//   module.exports.handleUpdateTag = async (req, res) => {
//     const { name } = req.body;
//     const data = await updateTag(req.params.id, {
//       name,
//     });
//     return res.status(200).send(data);
//   };

//   module.exports.handleDeleteTag = async (req, res) => {
//     await removeTag(req.params.id);
//     res.sendStatus(204);
