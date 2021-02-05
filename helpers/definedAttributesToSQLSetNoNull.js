const omitBy = require("lodash/omitBy");

const definedAttributesToSQLSetNoNull = (attributes) =>
  Object.keys(
    omitBy(attributes, (item) => typeof item === "undefined" || item === "")
  )
    .map((k) => `${k} = :${k}`)
    .join(", ");

module.exports = definedAttributesToSQLSetNoNull;
