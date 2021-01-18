const utils = require("./utils");

const debug = false;

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

  app.get("/getEntityEntriesWithProperties", function (req, res) {
    const query = `SELECT * FROM (SELECT * FROM ${req.query.database}.entity WHERE entity_type_id=${req.query.entity_type_id}) e LEFT JOIN 
    (SELECT entity_id, entity_type_property_id, property_value from ${req.query.database}.entity_properties) ep ON 
    ep.entity_id = e.id 
    LEFT JOIN (SELECT property_type, property_name, id as etpid FROM ${req.query.database}.entity_type_properties) etp ON 
    etp.etpid=ep.entity_type_property_id`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
  
};
