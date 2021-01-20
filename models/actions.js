const Joi = require('joi');
const db = require('../db');
const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

// this function checks is a action with the same name already exists
const actionAlreadyExists = async (name) => {
  const rows = await db.query('SELECT * FROM action WHERE name = ?', [name]);
  if (rows.length) {
    return true;
  }
  return false;
};

// only the getActions function was really checked
const getActions = async () => {
  return db.query('SELECT * FROM action');
};

const getOneAction = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM action WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('actions', id);
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

  // checking the action does not already exist
  if (attributes.name) {
    let shouldThrow = false;
    if (forUpdate) {
      const toUpdate = await getOneAction(udpatedRessourceId);
      shouldThrow =
        !(toUpdate.name === attributes.name) &&
        (await actionAlreadyExists(attributes.name));
    } else {
      shouldThrow = await actionAlreadyExists(attributes.name);
    }
    if (shouldThrow) {
      throw new ValidationError([
        { message: 'action_already_exists', path: ['action'], type: 'unique' },
      ]);
    }
  }
};

const createAction = async (newAttributes) => {
  await validate(newAttributes);
  return db
    .query(
      `INSERT INTO action SET ${definedAttributesToSqlSet(newAttributes)}`,
      newAttributes
    )
    .then((res) => getOneAction(res.insertId));
};

const updateAction = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const namedAttributes = definedAttributesToSqlSet(newAttributes);
  return db
    .query(`UPDATE action SET ${namedAttributes} WHERE id = :id`, {
      ...newAttributes,
      id,
    })
    .then(() => getOneAction(id));
};

const removeAction = async (id, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM action WHERE id = ?', [id]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('action', id);
  return false;
};

module.exports = {
  getActions,
  getOneAction,
  createAction,
  updateAction,
  removeAction,
};
