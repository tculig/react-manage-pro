module.exports = function (app, connection) {
  app.post("/addElement", function (req, res) {
    getPostData(req, (newElement) => {
      runQueryFromObject(
        connection,
        newElement.databaseID,
        newElement.tableID,
        newElement.data,
        true,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/updateElement", function (req, res) {
    getPostData(req, (updatedElement) => {
      runQueryFromObject(
        connection,
        updatedElement.databaseID,
        updatedElement.tableID,
        updatedElement.data,
        false,
        (results) => {
          res.send(results);
        }
      );
    });
  });

  app.post("/removeElement", function (req, res) {
    getPostData(req, (data) => {
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
