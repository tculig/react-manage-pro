const mysql = require("mysql");
const express = require("express");
const _ = require("lodash");

const app = express();

const connection_config_root = {
  host: "localhost",
  user: "root",
  password: "",
  database: "",
  timezone: "UTC",
  multipleStatements: true,
  dateStrings: ["DATE", "DATETIME"],
};
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const connectionRoot = mysql.createConnection(connection_config_root);

require("./utilEndpoints")(app,connectionRoot);
require("./EntityTypes")(app,connectionRoot);
require("./EntityInstances")(app,connectionRoot);
require("./DatabaseSetup")(app,connectionRoot);

app.listen(3009, function () {
  console.log("Listening on port 3009!");
});
