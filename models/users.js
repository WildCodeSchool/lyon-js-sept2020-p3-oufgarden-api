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
// Hash du password avec argon 2
const hashPassword = async (user) => argon2.hash(user.password);

// Methode pour récuperer un user avec son id
const getOneUser = async (id, failIfNotFound = true) => {
  const rows = await db.query('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError('contacts', id);
  return null;
};

// Validation avec Joi, voir pour implementation confirmation de mdp ??
const validate = async (attributes, options = { udpatedRessourceId: null }) => {
  const { udpatedRessourceId } = options;
  const forUpdate = !!udpatedRessourceId;
  // Il faudra implémenter ici la confirm de password
  // Creation du schema pour la validation via Joi
  const schema = Joi.object().keys({
    firstname: Joi.string().min(0).max(150),
    lastname: Joi.string().min(0).max(150),
    email: forUpdate ? Joi.string().email() : Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
      .required()
      .label("Password doesn't match requirement"),
    //  Carreful ! ESlint n'aime pas les '\' Attention au Regex //
    is_admin: Joi.number().integer().min(0).max(1).required(),
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

// Methode pour créer un user Et pour hashser son password
const createUser = async (newAttributes) => {
  await validate(newAttributes);
  const { email } = newAttributes;
  const password = await hashPassword(newAttributes);
  const newObj = { ...newAttributes, password };
  const res = await db.query(
    `INSERT INTO user SET ${definedAttributesToSqlSet(newObj)}`,
    newObj
  );
  return { email, id: res.insertId };
};

// Méthode pour vérifier le match des password avec argon
const verifyPassword = async (user, plainPassword) => {
  return argon2.verify(user.password, plainPassword);
};

// Methode pour récuperer toute la liste d'user
const getUsers = async () => {
  return db.query('SELECT * FROM user');
};
// Methode pour modifier un user
const updateUser = async (id, newAttributes) => {
  await validate(newAttributes, { udpatedRessourceId: id });
  const namedAttributes = definedAttributesToSqlSet(newAttributes);
  return db
    .query(`UPDATE user SET ${namedAttributes} WHERE id = :id`, {
      ...newAttributes,
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
  if (failIfNotFound) throw new RecordNotFoundError('contacts', id);
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
};
