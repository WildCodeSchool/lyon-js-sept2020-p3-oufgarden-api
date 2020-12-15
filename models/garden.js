const Joi = require('joi');
const db = require('../db');
const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

// this function checks if a garden with the same name already exists
const gardenAlreadyExists = async (name) => {
  const rows = await db.query('SELECT * FROM garden WHERE name = ?', [name]);
  if (rows.length) {
    return true;
  }
  return false;
};

const getGarden = async () => {
  return db.query('SELECT * FROM garden');
};

const getOneGarden = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM garden WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('garden', id);
  return null;
};

const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;
  // creating schema for validation by Joi
  const schema = Joi.object().keys({
    name: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);

  // checking the garden does not already exist
  if (attributes.name) {
    let shouldThrow = false;
    if (forUpdate) {
      const toUpdate = await getOneGarden(udpatedRessourceId);
      shouldThrow =
        !(toUpdate.name === attributes.name) &&
        (await gardenAlreadyExists(attributes.name));
    } else {
      shouldThrow = await gardenAlreadyExists(attributes.name);
    }
    if (shouldThrow) {
      throw new ValidationError([
        { message: 'garden_already_exists', path: ['garden'], type: 'unique' },
      ]);
    }
  }
};

const createGarden= async (newAttributes) => {
  await validate(newAttributes);
  return db
    .query(
      `INSERT INTO garden SET ${definedAttributesToSqlSet(newAttributes)}`,
      newAttributes
    )
    .then((res) => getOneGarden(res.insertId));
};

const updateGarden = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const namedAttributes = definedAttributesToSqlSet(newAttributes);
  return db
    .query(`UPDATE garden SET ${namedAttributes} WHERE id = :id`, {
      ...newAttributes,
      id,
    })
    .then(() => getOneGarden(id));
};

const removeGarden = async (id, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM garden WHERE id = ?', [id]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('garden', id);
  return false;
};

module.exports = {
  getGarden,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
};
