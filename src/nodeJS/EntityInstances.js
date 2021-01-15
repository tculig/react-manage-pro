const utils = require("./utils");

const debug = true;

module.exports = function (app, connection) {
  app.get("/getEntityTypeProperties", function (req, res) {
    const query = `SELECT * FROM ${req.query.database}.entity_type_properties WHERE entity_type_id=${req.query.entity_type_id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

  app.get("/getEntityTypeEntries", function (req, res) {
    const query = `SELECT * FROM ${req.query.database}.entity WHERE entity_type_id=${req.query.entity_type_id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
};
