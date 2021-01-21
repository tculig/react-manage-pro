const utils = require("./utils");

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

  app.post("/getReportsByTypes", function (req, res) {
    utils.getPostData(req, (element) => {
      const query = `SELECT * FROM ${element.database}.reports WHERE reportType IN (${element.data.values.join(",")}) AND active = 1`;
      if (debug) console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });
};
