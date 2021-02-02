const db = require("../db");
const definedAttributesToSqlSet = require("../helpers/definedAttributesToSQLSet.js");

const getReservations = async () => {
  const currentReservations = await db.query(
    "SELECT garden_id, COUNT(id) AS current_reservations FROM reservation GROUP BY reservation.garden_id"
  );

  const reservationData = await db.query(
    "SELECT reservation.*, garden.max_users FROM reservation INNER JOIN garden ON garden.id = reservation.garden_id"
  );

  const newData = reservationData.map((reservation) => {
    let newReservation = { ...reservation };
    for (let i = 0; i < currentReservations.length; i += 1) {
      if (currentReservations[i].garden_id === reservation.garden_id) {
        newReservation = {
          ...newReservation,
          current_reservations: currentReservations[i].current_reservations,
        };
      }
    }
    return newReservation;
  });

  return newData;
};

const createReservation = async (newAttributes) => {
  /*  await validate(newAttributes); */
  const res = await db
    .query(
      `INSERT INTO reservation SET ${definedAttributesToSqlSet(newAttributes)}`,
      newAttributes
    )
    .catch((err) => {
      console.log(err);
      return false;
    });
  if (!res) {
    return false;
  }
  return { id: res.insertId };
};

const getGardenReservation = async (id) => {
  return db.query(
    "SELECT R.*, U.firstname, U.lastname, TS.start_time, TS.end_time FROM reservation as R  JOIN user AS U ON R.user_id = U.id JOIN time_slot as TS ON R.time_slot_id=TS.id WHERE garden_id = ?",
    [id]
  );
};
module.exports = {
  getReservations,
  createReservation,
  getGardenReservation,
};
