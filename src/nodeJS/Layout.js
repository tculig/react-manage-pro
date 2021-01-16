const utils = require("./utils");

const debug = false;

module.exports = function (app, connection) {
  app.get("/getLayoutByID", function (req, res) {
    const query = `SELECT * FROM ${req.query.database}.${req.query.table} WHERE id = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

  app.get("/getLayoutWithPropertiesByID", function (req, res) {
    let arrayLayout = ["name","dateCreated","active"];
    const query = `SELECT 
    ${arrayLayout.map(el => `et.${el}`).join(",")}
    , etp.* FROM ${req.query.database}.${req.query.table}
    et LEFT JOIN ${req.query.database}.${req.query.table}_properties etp on etp.layout_id=et.id WHERE et.id = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

  app.post("/getBatchTemplateProperties", function (req, res) {
    utils.getPostData(req, (element) => {
      const query = `SELECT * FROM ${element.database}.template_properties WHERE layout_id IN (${element.data.join(",")})`;
      if (debug) console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });
};
