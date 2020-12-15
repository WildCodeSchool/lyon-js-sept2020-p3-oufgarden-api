const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');

const store = new MySQLStore(db.connectionOptions);
module.exports = store;
