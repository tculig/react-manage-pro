const debug = false;

module.exports = function (app, connection) {
  app.get("/getAvailableTemplates", function (req, res) {
    const query = `SELECT * FROM ${req.query.databaseID}.template`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

  app.get("/getTemplateByID", function (req, res) {
    const query = `SELECT * FROM ${req.query.databaseID}.template WHERE id = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
};
