function daisyChainGet(connectionObj, query, callback) {
  console.log(query);
  connectionObj.query(query, function (error, results, fields) {
    if (error) console.log(error);
    if (callback) {
      callback(results);
    } else {
      return results;
    }
  });
}

function runQueryFromObject(
  connection,
  databaseID,
  tableID,
  object,
  createNew,
  callback
) {
  let query = "SHOW COLUMNS FROM `" + databaseID + "`.`" + tableID + "`";
  connection.query(query, [object], function (error, results, fields) {
    if (error) console.log(error);
    let query2 = "INSERT INTO `" + databaseID + "`.`" + tableID + "` ";
    if (!createNew)
      query2 = "UPDATE `" + databaseID + "`.`" + tableID + "` SET ";
    let querySegment1 = "";
    let querySegment2 = "";
    let zarez = "",
      zagrada1 = "(",
      zagreda2 = " VALUES ";
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        let contains = false;
        for (let k = 0; k < results.length; k++) {
          if (results[k].Field == key) contains = true;
        }
        if (!contains) continue;
        if (!createNew) {
          querySegment2 += zarez + "`" + key + "`=";
        } else {
          querySegment2 += zagreda2 + zagrada1 + zarez;
        }
        if (createNew) querySegment1 += zagrada1 + zarez + "`" + key + "`";
        if (object[key] == null) {
          querySegment2 += "null";
        } else if (typeof object[key] == "object") {
          querySegment2 += "'" + JSON.stringify(object[key]) + "'";
        } else if (typeof object[key] == "boolean") {
          querySegment2 += object[key];
        } else {
          querySegment2 += "'" + object[key] + "'";
        }

        zarez = ",";
        zagrada1 = "";
        zagreda2 = "";
      }
    }
    if (createNew) {
      querySegment1 += ")";
      querySegment2 += ")";
    }
    query2 += querySegment1;
    query2 += querySegment2;
    if (!createNew) query2 += " WHERE `id`='" + object.id + "'";
    console.log(query2);
    connection.query(query2, function (error2, results2, fields) {
      if (error2) {
        if (callback) callback(error2);
      } else {
        if (callback) callback(results2);
      }
    });
  });
}

function getPostData(req, callback) {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      let data = JSON.parse(body);
      callback(data);
    });
  }
}

module.exports = {
    daisyChainGet,
    runQueryFromObject,
    getPostData
}
