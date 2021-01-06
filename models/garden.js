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

const removeGarden = async (id, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM garden WHERE id = ?', [id]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('garden', id);
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
    picture: Joi.string().min(0).max(150),
    description: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    exposition: Joi.string().min(0).max(150),
    address_id: forUpdate
      ? Joi.number().integer()
      : Joi.number().integer().required(),
    map: Joi.string().min(0).max(150),
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

const getOneAddress = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM address WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('address', id);
  return null;
};

const createAddress = async (address) => {
  const addressAttributes = {
    street: address.address_street,
    city: address.address_city,
    zip_code: address.address_zipcode,
  };
  // rajouter validation des données addresse
  return db
    .query(
      `INSERT INTO address SET ${definedAttributesToSqlSet(addressAttributes)}`,
      addressAttributes
    )
    .then((res) => getOneAddress(res.insertId));
};

const createGarden = async (newAttributes) => {
  // console.log(newAttributes);

  await validate(newAttributes);

  // eslint-disable-next-line no-unused-vars
  const { zone_details, ...rest } = newAttributes;
  console.log(rest);

  return db
    .query(`INSERT INTO garden SET ${definedAttributesToSqlSet(rest)}`, rest)
    .then((res) => getOneGarden(res.insertId));
};

const createZonesForGardenId = async (gardenId, zone_details) => {
  // ajouter une validation des données !
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
    })) // id de la zone, à voir comment ça marche pour plusieurs insertions ?
    .catch((err) => {
      console.log(err);
      return false;
    });

  if (
    // !dataValidation || - la validation des données est à ajouter
    result === false
  ) {
    // eslint-disable-next-line no-use-before-define
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
