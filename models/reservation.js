// const Joi = require('joi');
const db = require('../db');
// const { RecordNotFoundError, ValidationError } = require('../error-types');
// const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

// this function checks is a tag with the same name already exists
// const tagAlreadyExists = async (name) => {
//   const rows = await db.query('SELECT * FROM tag WHERE name = ?', [name]);
//   if (rows.length) {
//     return true;
//   }
//   return false;
// };

const getReservations = async () => {
  const currentReservations = await db.query(
    'SELECT garden_id, COUNT(id) AS current_reservations FROM reservation GROUP BY reservation.garden_id'
  );
  console.log(currentReservations);
  const reservationData = await db.query(
    'SELECT reservation.*, garden.max_users FROM reservation INNER JOIN garden ON garden.id = reservation.garden_id'
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

// const validate = async (attributes, options = { udpatedRessourceId: null }) => {
//   const { udpatedRessourceId } = options;
//   const forUpdate = !!udpatedRessourceId;
//   // creating schema for validation by Joi
//   const schema = Joi.object().keys({
//     name: forUpdate
//       ? Joi.string().min(0).max(150)
//       : Joi.string().min(0).max(150).required(),
//   });

//   const { error } = schema.validate(attributes, {
//     abortEarly: false,
//   });
//   if (error) throw new ValidationError(error.details);

//   // checking the tag does not already exist
//   if (attributes.name) {
//     let shouldThrow = false;
//     if (forUpdate) {
//       const toUpdate = await getOneTag(udpatedRessourceId);
//       shouldThrow =
//         !(toUpdate.name === attributes.name) &&
//         (await tagAlreadyExists(attributes.name));
//     } else {
//       shouldThrow = await tagAlreadyExists(attributes.name);
//     }
//     if (shouldThrow) {
//       throw new ValidationError([
//         { message: 'tag_already_exists', path: ['tag'], type: 'unique' },
//       ]);
//     }
//   }
// };

// const createTag = async (newAttributes) => {
//   await validate(newAttributes);
//   return db
//     .query(
//       `INSERT INTO tag SET ${definedAttributesToSqlSet(newAttributes)}`,
//       newAttributes
//     )
//     .then((res) => getOneTag(res.insertId));
// };

// const updateTag = async (id, newAttributes) => {
//   await validate(newAttributes, { udpatedRessourceId: id });
//   const namedAttributes = definedAttributesToSqlSet(newAttributes);
//   return db
//     .query(`UPDATE tag SET ${namedAttributes} WHERE id = :id`, {
//       ...newAttributes,
//       id,
//     })
//     .then(() => getOneTag(id));
// };

// const removeTag = async (id, failIfNotFound = true) => {
//   const res = await db.query('DELETE FROM tag WHERE id = ?', [id]);
//   if (res.affectedRows !== 0) {
//     return true;
//   }
//   if (failIfNotFound) throw new RecordNotFoundError('tag', id);
//   return false;
// };

module.exports = {
  getReservations,
  //   getOneTag,
  //   createTag,
  //   updateTag,
  //   removeTag,
};
