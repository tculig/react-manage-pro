const utils = require("./utils");

const debug = false;

module.exports = function (app, connection) {
  app.get("/getAvailableEntityTypesWithFieldCount", function (req, res) {
    const query = `SELECT * FROM ${req.query.databaseID}.entity_type et
      LEFT JOIN (SELECT entity_type_id, count(*) as number_of_fields FROM ${req.query.databaseID}.entity_type_properties 
      GROUP BY entity_type_id) etp ON etp.entity_type_id = et.id`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
};
