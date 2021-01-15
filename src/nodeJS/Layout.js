const debug = false;

module.exports = function (app, connection) {
  app.get("/getAvailableLayouts", function (req, res) {
    const query = `SELECT * FROM ${req.query.database}.${req.query.table}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

  app.get("/getLayoutByID", function (req, res) {
    const query = `SELECT * FROM ${req.query.database}.${req.query.table} WHERE id = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

  app.get("/getLayoutWithPropertiesByID", function (req, res) {
    let arrayLayout = ["id","entityTypeId","name","dateCreated","active"];
    let arrayLayoutProperties = ["id as gridletId","x","y","w","h","static","parent","text","bgcolor","scaleFactor","fontConfiguration","entityDataConfiguration"];
    const query = `SELECT 
    ${arrayLayout.map(el => `et.${el}`).join(",")}
    ,
    ${arrayLayoutProperties.map(el => `etp.${el}`).join(",")} 
    FROM ${req.query.database}.${req.query.table}
    et LEFT JOIN ${req.query.database}.${req.query.table}_properties etp on etp.${req.query.table}_id=et.id WHERE et.id = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

 
};
