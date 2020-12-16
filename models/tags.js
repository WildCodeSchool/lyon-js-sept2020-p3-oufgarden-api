const Joi = require('joi');
const db = require('../db');
const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

// this function checks is a tag with the same name already exists
const tagAlreadyExists = async (name) => {
  const rows = await db.query('SELECT * FROM tag WHERE name = ?', [name]);
  if (rows.length) {
    return true;
  }
  return false;
};

const getTags = async () => {
  return db.query('SELECT * FROM tag');
};

const getOneTag = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM tag WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('tags', id);
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

  // checking the tag does not already exist
  if (attributes.name) {
    let shouldThrow = false;
    if (forUpdate) {
      const toUpdate = await getOneTag(udpatedRessourceId);
      shouldThrow =
        !(toUpdate.name === attributes.name) &&
        (await tagAlreadyExists(attributes.email));
    } else {
      shouldThrow = await tagAlreadyExists(attributes.name);
    }
    if (shouldThrow) {
      throw new ValidationError([
        { message: 'tag_already_exists', path: ['tag'], type: 'unique' },
      ]);
    }
  }
};

const createTag = async (newAttributes) => {
  await validate(newAttributes);
  return db
    .query(
      `INSERT INTO tag SET ${definedAttributesToSqlSet(newAttributes)}`,
      newAttributes
    )
    .then((res) => getOneTag(res.insertId));
};

const updateTag = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const namedAttributes = definedAttributesToSqlSet(newAttributes);
  return db
    .query(`UPDATE tag SET ${namedAttributes} WHERE id = :id`, {
      ...newAttributes,
      id,
    })
    .then(() => getOneTag(id));
};

const removeTag = async (id, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM tag WHERE id = ?', [id]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('tag', id);
  return false;
};

module.exports = {
  getTags,
  getOneTag,
  createTag,
  updateTag,
  removeTag,
};
