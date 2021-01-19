const utils = require("./utils");
const debug = true;

module.exports = function (app, connection) {
  app.post("/createElement", function (req, res) {
    utils.getPostData(req, (element) => {
      utils.runQueryFromObject(
        connection,
        element.database,
        element.table,
        element.data,
        utils.QUERY_ACTIONS.INSERT,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/createElements", function (req, res) {
    utils.getPostData(req, (element) => {
      utils.runMultiQueryFromObject(
        connection,
        element.database,
        element.table,
        element.data,
        utils.QUERY_ACTIONS.INSERT,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/updateElement", function (req, res) {
    utils.getPostData(req, (element) => {
      utils.runQueryFromObject(
        connection,
        element.database,
        element.table,
        element.data,
        utils.QUERY_ACTIONS.UPDATE,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/selectElements", function (req, res) {
    utils.getPostData(req, (element) => {
      utils.runQueryFromObject(
        connection,
        element.database,
        element.table,
        element.data,
        utils.QUERY_ACTIONS.SELECT,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/createTable", function (req, res) {
    utils.getPostData(req, (element) => {
      let query = "CREATE TABLE `"+element.database+"`.`" +element.table +"` (`id` INT NOT NULL AUTO_INCREMENT";
      const fields = element.data;
      for (var key in fields) {
        if (fields.hasOwnProperty(key)) {
          query += ",`" + key + "` " + fields[key]+" NULL";
        }
      }
      query += ",`active` BOOLEAN NOT NULL DEFAULT TRUE,PRIMARY KEY (`id`))";
      if(debug) console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });

  app.post("/dropTable", function (req, res) {
    utils.getPostData(req, (element) => {
      let query = "DROP TABLE  `"+element.database+"`.`" +element.table +"`";
      if(debug) console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });

  app.post("/selectAll", function (req, res) {
    utils.getPostData(req, (element) => {
      let query = "SELECT * FROM `"+element.database+"`.`" +element.table +"`";
      if(debug) console.log(query);
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });

  app.post("/removeElement", function (req, res) {
    utils.getPostData(req, (data) => {
      const key = Object.keys(data.data)[0];
      let query = "DELETE FROM `" + data.database + "`.`" + data.table + "` WHERE " + key + " = " + data.data[key];
      if(debug) console.log(query);  
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });
};
