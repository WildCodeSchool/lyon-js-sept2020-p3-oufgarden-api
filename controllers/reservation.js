const {
  getReservations,
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
  console.log(req.body);
  console.log(req.currentUser);
  const data = { user_id: req.currentUser.id };
  /* const { name } = req.body; */
  /* const data = await createReservation({
    name,
  }); */
  return res.status(201).send(data);
};

//   module.exports.handleGetOneTag = async (req, res) => {
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
//   };
