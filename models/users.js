const Joi = require('joi');
const argon2 = require('argon2');
const db = require('../db');
const { RecordNotFoundError, ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js');

// On check ici si l'email existe déjà
const emailAlreadyExists = async (email) => {
  const rows = await db.query('SELECT * FROM user WHERE email = ?', [email]);
  if (rows.length) {
    return true;
  }
  return false;
};

// Trouver un utilisateur par l'email
const findByEmail = async (email, failIfNotFound = true) => {
  const rows = await db.query(`SELECT * FROM user WHERE email = ?`, [email]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError();
  return null;
};

// get user by id
const getOneUser = async (id, failIfNotFound = true) => {
  const rows = await db.query(
    'SELECT user.*, GROUP_CONCAT(userToGarden.garden_id) as garden_id_concat FROM user INNER JOIN userToGarden ON userToGarden.user_id=user.id WHERE id = ? GROUP BY user.id ;',
    [id]
  );
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('users', id);
  return null;
};

// Methode qui permet de retrouver l'admin
const findAdmin = async (id, failIfNotFound = true) => {
  const rows = await db.query(
    'SELECT * FROM user WHERE id = ? AND is_Admin = 1',
    [id]
  );
  if (rows.length) return rows[0];
  if (failIfNotFound) throw new RecordNotFoundError();
  return null;
};
// hashing password with argon2
const hashPassword = async (user) => argon2.hash(user.password);

// Joi validation
const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;
  // creating schema for Joi validation

  const schema = Joi.object().keys({
    birthdate: Joi.date(),
    membership_start: Joi.date(),
    user_creation: forUpdate ? Joi.date() : Joi.date().required(),
    phone: Joi.string().length(10),
    gender_marker: forUpdate
      ? Joi.string().allow('madame', 'monsieur', 'inconnu')
      : Joi.string().allow('madame', 'monsieur', 'inconnu').required(),
    firstname: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    lastname: forUpdate
      ? Joi.string().min(0).max(150)
      : Joi.string().min(0).max(150).required(),
    email: forUpdate ? Joi.string().email() : Joi.string().email().required(),
    password: forUpdate
      ? Joi.string().pattern(
          new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')
        )
      : Joi.string()
          .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
          .required()
          .label("Password doesn't match requirement"),
    //  Careful! \ may need to be escaped in regex because of ESlint
    is_admin: forUpdate
      ? Joi.number().integer().min(0).max(1)
      : Joi.number().integer().min(0).max(1).required(),
  });

  const { error } = schema.validate(attributes, {
    abortEarly: false,
  });

  if (error) throw new ValidationError(error.details);

  if (attributes.email) {
    let shouldThrow = false;
    if (forUpdate) {
      const toUpdate = await getOneUser(udpatedRessourceId);
      shouldThrow =
        !(toUpdate.email === attributes.email) &&
        (await emailAlreadyExists(attributes.email));
    } else {
      shouldThrow = await emailAlreadyExists(attributes.email);
    }
    if (shouldThrow) {
      throw new ValidationError([
        { message: 'email_taken', path: ['email'], type: 'unique' },
      ]);
    }
  }
};

// creating a user and hashing their password
const createUser = async (newAttributes) => {
  await validate(newAttributes);
  const { email } = newAttributes;
  const password = await hashPassword(newAttributes);
  const newObj = { ...newAttributes, password };
  const res = await db
    .query(`INSERT INTO user SET ${definedAttributesToSqlSet(newObj)}`, newObj)
    .catch((err) => {
      console.log(err);
      return false;
    });
  if (!res) {
    return false;
  }
  return { email, id: res.insertId };
};

const linkUserToGarden = async (userId, gardenArray) => {
  if (gardenArray.length > 0) {
    // const gardenValidation = await validateTags(gardenArray);
    let valuePairsString = '';
    gardenArray.forEach((garden) => {
      valuePairsString += `(${+userId}, ${+garden}),`; // + to convert it to number or make sure it's a number
    });
    valuePairsString = valuePairsString.slice(0, -1); // removing the last comma

    const result = await db
      .query(
        `INSERT INTO userToGarden (user_id, garden_id) VALUES ${valuePairsString};`
      )
      .catch(() => {
        return false;
      });

    if (/* !gardenValidation || */ result === false) {
      throw new ValidationError([
        {
          message: 'there was a problem to the user to gardens',
          path: ['userToGarden'],
          type: 'insertionError',
        },
      ]);
    }
  }
};

// checking if the password is right thanks to argon2
const verifyPassword = async (user, plainPassword) => {
  return argon2.verify(user.password, plainPassword);
};

// get all users
const getUsers = async () => {
  return db.query('SELECT * FROM user');
};

const updateUser = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });

  let newObj = newAttributes;

  if (newAttributes.password) {
    const password = await hashPassword(newAttributes);
    newObj = { ...newAttributes, password };
  }

  const namedAttributes = definedAttributesToSqlSet(newObj);
  return db
    .query(`UPDATE user SET ${namedAttributes} WHERE id = :id`, {
      ...newObj,
      id,
    })
    .then(() => getOneUser(id));
};
// Methode pour supprimer un user
const removeUser = async (id, failIfNotFound = true) => {
  const res = await db.query('DELETE FROM user WHERE id = ?', [id]);
  if (res.affectedRows !== 0) {
    return true;
  }
  if (failIfNotFound) throw new RecordNotFoundError('users', id);
  return false;
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
  verifyPassword,
  findByEmail,
  findAdmin,
  linkUserToGarden,
};
