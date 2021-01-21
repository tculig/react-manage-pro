const debug = true;

module.exports = function (app, connection) {
  app.get("/getEntityReports", function (req, res) {
    const query = `SELECT et.name as reportTypeName, etp.* FROM ${req.query.database}.report_types et
              LEFT JOIN ${req.query.database}.reports etp on et.id=etp.reportType WHERE etp.entityId = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
};
