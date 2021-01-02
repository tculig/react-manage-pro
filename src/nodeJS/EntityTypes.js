const utils = require("./utils");

const debug = false;

module.exports = function (app, connection) {
  app.post("/getAvailableEntities", function (req, res) {
    utils.getPostData(req, (element) => {
      const query = "SELECT * FROM `"+element.data.mainDatabase+"`.`entities`";
      if(debug) console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        let query2 = "SHOW TABLES IN `"+element.data.entitiesDatabase+"`";
        if(debug) console.log(query2);
        connection.query(query2, function (error2, results2, fields2) {
          if (error2) console.log(error2);
          let query3 = "";
          for (let i = 0; i < results2.length; i++) {
            query3 +=
              "SELECT COUNT(*) FROM `"+element.data.entitiesDatabase+"`.`" +
              results2[i]["Tables_in_"+element.data.entitiesDatabase] +
              "`";
            if (i < results2.length - 1) query3 += " UNION ALL";
          }
          if (results2.length == 0) {
            res.send(results2);
          } else {
            if(debug) console.log(query3);
            connection.query(query3, function (error3, results3, fields2) {
              if (error3) console.log(error3);
              let rowCounts = [];
              for (let i = 0; i < results2.length; i++) {
                rowCounts.push({
                  tableName: results2[i]["Tables_in_"+element.data.entitiesDatabase],
                  activeEntries: results3[i]["COUNT(*)"],
                });
              }
              for (let i = 0; i < results.length; i++) {
                for (let j = 0; j < rowCounts.length; j++) {
                  if (results[i].name.toLowerCase() == rowCounts[j].tableName.toLowerCase()) {
                    results[i].activeEntries = rowCounts[j].activeEntries;
                  }
                }
              }
              if(debug) console.log(results);
              res.send(results);
            });
          }
        });
      });
    });
  });
};
