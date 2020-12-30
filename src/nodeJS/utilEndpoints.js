const utils = require("./utils");

module.exports = function (app, connection) {
  app.post("/addElement", function (req, res) {
    console.log("OK")
    utils.getPostData(req, (newElement) => {
      console.log(newElement)
      utils.runQueryFromObject(
        connection,
        newElement.databaseID,
        newElement.tableID,
        newElement.data,
        utils.QUERY_ACTIONS.INSERT,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/updateElement", function (req, res) {
    utils.getPostData(req, (updatedElement) => {
      utils.runQueryFromObject(
        connection,
        updatedElement.databaseID,
        updatedElement.tableID,
        updatedElement.data,
        utils.QUERY_ACTIONS.UPDATE,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/selectElement", function (req, res) {
    utils.getPostData(req, (updatedElement) => {
      utils.runQueryFromObject(
        connection,
        updatedElement.databaseID,
        updatedElement.tableID,
        updatedElement.data,
        utils.QUERY_ACTIONS.SELECT,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/removeElement", function (req, res) {
    utils.getPostData(req, (data) => {
      const key = Object.keys(data.data)[0];
      let query =
        "DELETE FROM `" +
        data.databaseID +
        "`.`" +
        data.tableID +
        "` WHERE " +
        key +
        " = " +
        data.data[key];
      connection.query(query, function (error, results, fields) {
        if (error) console.log(error);
        res.send(results);
      });
    });
  });
};
