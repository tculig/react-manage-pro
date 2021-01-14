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

  app.get("/getTemplateWithPropertiesByID", function (req, res) {
    let arrayTemplate = ["id","entityTypeId","name","dateCreated","active"];
    let arrayTemplateProperties = ["id as gridletId","x","y","w","h","static","parent","text","bgcolor","scaleFactor","fontConfiguration","entityDataConfiguration"];
    const query = `SELECT 
    ${arrayTemplate.map(el => `et.${el}`).join(",")}
    ,
    ${arrayTemplateProperties.map(el => `etp.${el}`).join(",")} 
    FROM ${req.query.databaseID}.template 
    et LEFT JOIN ${req.query.databaseID}.template_properties etp on etp.template_id=et.id WHERE et.id = ${req.query.id}`;
    if (debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });

 
};
