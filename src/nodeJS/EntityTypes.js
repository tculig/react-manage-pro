module.exports = function (app, connection) {
  app.post("/createEntityTable", function (req, res) {
    getPostData(req, (entityData) => {
      let query =
        "CREATE TABLE `hsvisumentities2`.`" +
        entityData.data.entityName +
        "` (`id` INT NOT NULL AUTO_INCREMENT";
      const fields = JSON.parse(entityData.data.fields);
      for (let i = 0; i < fields.length; i++) {
        query += ",`" + fields[i].fieldName + "` " + fields[i].fieldType.value;
      }
      query += ",`active` BOOLEAN NOT NULL DEFAULT TRUE,PRIMARY KEY (`id`))";
      console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });

  app.get("/removeEntityTable", function (req, res) {
    const query = "DROP TABLE `hsvisumentities2`.`" + req.query.tableID + "`";
    //console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
  app.get("/getEntityInfo", function (req, res) {
    const query =
      "SELECT * FROM `hsvisum2`.`entities` WHERE `id`=" + req.query.entityID;
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      res.send(results);
    });
  });
  app.get("/getAvailableEntities", function (req, res) {
    const query = "SELECT * FROM `hsvisum2`.`entities`";
    connection.query(query, function (error, results, fields) {
      if (error) console.log(error);
      let query2 = "SHOW TABLES IN `hsvisumentities2`";
      connection.query(query2, function (error2, results2, fields2) {
        if (error2) console.log(error2);
        let query3 = "";
        for (let i = 0; i < results2.length; i++) {
          query3 +=
            " SELECT COUNT(*) FROM `hsvisumentities2`.`" +
            results2[i].Tables_in_hsvisumentities +
            "`";
          if (i < results2.length - 1) query3 += " UNION ALL";
        }
        if (results2.length == 0) {
          res.send(results2);
        } else {
          connection.query(query3, function (error3, results3, fields2) {
            if (error3) console.log(error3);
            let rowCounts = [];
            for (let i = 0; i < results2.length; i++) {
              rowCounts.push({
                tableName: results2[i].Tables_in_hsvisumentities,
                activeEntries: results3[i]["COUNT(*)"],
              });
            }
            for (let i = 0; i < results.length; i++) {
              for (let j = 0; j < rowCounts.length; j++) {
                if (
                  results[i].entityName.toLowerCase() ==
                  rowCounts[j].tableName.toLowerCase()
                ) {
                  results[i].activeEntries = rowCounts[j].activeEntries;
                }
              }
            }
            res.send(results);
          });
        }
      });
    });
  });
};
