const Joi = require('joi');

const db = require('../db');
const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

// basic functions for address table /////////////////////////////////////////
const getOneAddress = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM address WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('address', id);
  return null;
};

const validateAddress = async (
  attributes,
  options = { udpatedRessourceId: null }
) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;
  // creating schema for validation by Joi
  const schema = Joi.object().keys({
    address_street: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    address_city: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    address_zipcode: forUpdate
      ? Joi.string().regex(/^(?:[0-8]\d|9[0-8])\d{3}$/)
      : Joi.string()
          .regex(/^(?:[0-8]\d|9[0-8])\d{3}$/)
          .required(),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) throw new ValidationError(error.details);
};

const createAddress = async (address) => {
  const addressAttributes = {
    street: address.address_street,
    city: address.address_city,
    zip_code: address.address_zipcode,
  };
  await validateAddress(address);
  return db
    .query(
      `INSERT INTO address SET ${definedAttributesToSqlSet(addressAttributes)}`,
      addressAttributes
    )
    .then((res) => getOneAddress(res.insertId))
    .catch(() => false);
};

const removeAddress = async (addressId, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM address WHERE id = ?', [addressId]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('address', addressId);
  return false;
};

// basic functions for garden table //////////////////////////
// this function checks if a garden with the same name already exists
const gardenAlreadyExists = async (name) => {
  const rows = await db.query('SELECT * FROM garden WHERE name = ?', [name]);
  if (rows.length) {
    return true;
  }
  return false;
};

const getGarden = async (userId) => {
  if (userId) {
    return db.query(
      'SELECT garden.* FROM garden INNER JOIN userToGarden AS UTG ON garden.id = UTG.garden_id WHERE UTG.user_id= ?',
      [userId]
    );
  }
  return db.query('SELECT * FROM garden');
};

// removing a garden must remove the connected address, zones, etc | everything is automativ thanks to cascade deleting, except the address //////////////////////////////
const removeGarden = async (removedGardenId, failIfNotFound = true) => {
  console.log(removedGardenId);
  const removedAddressId = await db
    .query('SELECT address_id FROM garden WHERE id = ?', [removedGardenId])
    .catch(() => false);

  if (
    !removedAddressId &&
    !removedAddressId[0].address_id &&
    typeof +removedAddressId[0].address_id !== 'number'
  ) {
    return false;
  }

  const res = await db.query('DELETE FROM garden WHERE id = ?', [
    removedGardenId,
  ]);
  if (res.affectedRows !== 0) {
    // then the garden was deleted
    const wasAddressRemoved = await removeAddress(
      removedAddressId[0].address_id
    );
    return wasAddressRemoved;
  }
  if (failIfNotFound) throw new RecordNotFoundError('garden', removedGardenId);
  return false;
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
    description: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    exposition: Joi.string().min(0).max(150),
    address_id: forUpdate
      ? Joi.number().integer()
      : Joi.number().integer().required(),
    picture: Joi.string().min(0).max(150).allow('').allow(null),
    map: Joi.string().min(0).max(150).allow('').allow(null),
    zone_quantity: forUpdate
      ? Joi.number().integer().min(0).max(15)
      : Joi.number().integer().min(0).max(15).required(),
    zone_details: Joi.array(),
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

// create garden, and address, and zones... /////////////////////////

const createGarden = async (newAttributes) => {
  await validate(newAttributes);

  const { zone_details, ...rest } = newAttributes;

  return db
    .query(`INSERT INTO garden SET ${definedAttributesToSqlSet(rest)}`, rest)
    .then((res) => getOneGarden(res.insertId))
    .catch(() => false);
};

const validateZoneDetailsArray = async (
  attributes,
  options = { udpatedRessourceId: null }
) => {
  const { udpatedRessourceId } = options;
  // eslint-disable-next-line no-unused-vars
  const forUpdate = !!udpatedRessourceId;
  // creating schema for validation by Joi
  const schema = Joi.array().items(Joi.object());

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });
  if (error) {
    return false;
  }
  return true;
  // throw new ValidationError(error.details);
};

const createZonesForGardenId = async (gardenId, zone_details) => {
  // ajouter une validation des données !
  const zoneDataValidation = await validateZoneDetailsArray(zone_details);

  let valuePairsString = '';
  zone_details.forEach((zone) => {
    valuePairsString += `(${+gardenId}, "${zone.zone_name}", "${zone.type}", "${
      zone.exposition
    }", "${zone.description}"),`; // + to convert it to number or make sure it's a number
  });
  valuePairsString = valuePairsString.slice(0, -1); // removing the last comma

  const result = await db
    .query(
      `INSERT INTO zone (garden_id, name, type, exposition, description) VALUES ${valuePairsString};`
    )
    .then((res) => ({
      affectedRows: res.affectedRows,
      firstInsertId: res.insertId,
    }))
    .catch((err) => {
      console.log(err);
      return false;
    });

  if (!zoneDataValidation || result === false) {
    removeGarden(gardenId);
    throw new ValidationError([
      {
        message:
          'there was a problem to create the zones for this garden, the garden was removed',
        path: ['zone'],
        type: 'insertionError',
      },
    ]);
  } else {
    return result;
  }
};

const linkZoneToPlantFamily = async (zoneId, plantFamilyArray) => {
  if (plantFamilyArray.length > 0) {
    // const tagValidation = await validateTags(plantFamilyArray);
    let valuePairsString = '';
    plantFamilyArray.forEach((plantFamilyId) => {
      valuePairsString += `(${+zoneId}, ${+plantFamilyId}),`; // + to convert it to number or make sure it's a number
    });
    valuePairsString = valuePairsString.slice(0, -1); // removing the last comma

    const result = await db
      .query(
        `INSERT INTO zoneToPlantFamily (zone_id, plantFamily_id) VALUES ${valuePairsString};`
      )
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });

    // if (
    //   // !tagValidation ||
    //   result === false) {
    //   removeZone(zoneId);
    //   throw new ValidationError([
    //     {
    //       message:
    //         'there was a problem to link the article to its tags, the article was removed',
    //       path: ['tagToArticle'],
    //       type: 'insertionError',
    //     },
    //   ]);
    // }
    return result;
  }
  return null;
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

module.exports = {
  getGarden,
  getOneGarden,
  createGarden,
  updateGarden,
  removeGarden,
  createAddress,
  getOneAddress,
  createZonesForGardenId,
  linkZoneToPlantFamily,
};
