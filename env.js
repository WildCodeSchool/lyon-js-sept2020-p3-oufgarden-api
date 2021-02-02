require("dotenv").config();

function getEnv(varibale) {
  const value = process.env[varibale];
  if (typeof value === "undefined") {
    console.warn(`Seems like the variable "${varibale}" is not set in the environment. 
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

const inProdEnv = getEnv("NODE_ENV") === "production";
const inDevEnv = getEnv("NODE_ENV") === "dev";
const inTestEnv = getEnv("NODE_ENV") === "test";

const SESSION_COOKIE_NAME = getEnv(`SESSION_COOKIE_NAME`);
const SESSION_COOKIE_SECRET = getEnv(`SESSION_COOKIE_SECRET`);
const CORS_ALLOWED_ORINGINS = getEnv(`CORS_ALLOWED_ORINGINS`);

const AUTH_EMAIL_ID = getEnv(`AUTH_EMAIL_ID`);
const AUTH_EMAIL_SECRET = getEnv(`AUTH_EMAIL_SECRET`);
const AUTH_EMAIL_AUTHO_CODE = getEnv(`AUTH_EMAIL_AUTHO_CODE`);
const AUTH_EMAIL_REFRESH_TOKEN = getEnv(`AUTH_EMAIL_REFRESH_TOKEN`);
const AUTH_EMAIL_ACCESS_TOKEN = getEnv(`AUTH_EMAIL_AUTHO_CODE`);

const SERVER_PORT = getEnv(`SERVER_PORT${inTestEnv ? "_TEST" : ""}`);

const DB_HOST = getEnv(`DB_HOST${inTestEnv ? "_TEST" : ""}`);
const DB_PORT = getEnv(`DB_PORT${inTestEnv ? "_TEST" : ""}`);
const DB_USER = getEnv(`DB_USER${inTestEnv ? "_TEST" : ""}`);
const DB_PASS = getEnv(`DB_PASS${inTestEnv ? "_TEST" : ""}`);
const DB_NAME = getEnv(`DB_NAME${inTestEnv ? "_TEST" : ""}`);

const SENDINBLUE_API_KEY = getEnv(`SENDINBLUE_API_KEY`);
const MAIL_TO = getEnv(`MAIL_TO`);

module.exports = {
  getEnv,
  inTestEnv,
  inProdEnv,
  inDevEnv,
  SERVER_PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_NAME,
  DB_PASS,
  SESSION_COOKIE_SECRET,
  CORS_ALLOWED_ORINGINS,
  SESSION_COOKIE_NAME,
  SENDINBLUE_API_KEY,
  MAIL_TO,
  AUTH_EMAIL_ID,
AUTH_EMAIL_SECRET,
AUTH_EMAIL_AUTHO_CODE,
AUTH_EMAIL_REFRESH_TOKEN
};

