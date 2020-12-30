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

const QUERY_ACTIONS = {
  INSERT: 0,
  UPDATE: 1,
  SELECT: 2
}

function runQueryFromObject(connection, databaseID, tableID, object, action, callback) {
  let query = "SHOW COLUMNS FROM `" + databaseID + "`.`" + tableID + "`";
  connection.query(query, [object], function (error, results, fields) {
    if (error) console.log(error);
    let query2 = "";
    switch(action){
      case QUERY_ACTIONS.INSERT: query2 = "INSERT INTO `" + databaseID + "`.`" + tableID + "` ";break;
      case QUERY_ACTIONS.UPDATE: query2 = "UPDATE `" + databaseID + "`.`" + tableID + "` SET ";break;
      case QUERY_ACTIONS.SELECT: query2 = "SELECT * FROM `" + databaseID + "`.`" + tableID + "` WHERE ";break;
    }
    let querySegment1 = "";
    let querySegment2 = "";
    let zarez = "",
      zarezSelect = "",
      zagrada1 = "(",
      zagreda2 = " VALUES ";
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        let contains = false;
        for (let k = 0; k < results.length; k++) {
          if (results[k].Field == key) contains = true;
        }
        if (!contains) continue;

        switch (action) {
          case QUERY_ACTIONS.INSERT:
            querySegment1 += zagrada1 + zarez + "`" + key + "`";
            querySegment2 += zagreda2 + zagrada1 + zarez;
            break;
          case QUERY_ACTIONS.UPDATE:
            querySegment2 += zarez + "`" + key + "`=";
            break;
          case QUERY_ACTIONS.SELECT:
            querySegment2 += zarezSelect + "`" + key + "`=";
            break;
        }
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
        zarezSelect = " AND ";
      }
    }
    switch (action) {
      case QUERY_ACTIONS.INSERT:
        querySegment1 += ")";
        querySegment2 += ")";
        query2 += querySegment1;
        query2 += querySegment2;
        break;
      case QUERY_ACTIONS.UPDATE:
        query2 += querySegment2;
        query2 += " WHERE `id`='" + object.id + "'";
        break;
      case QUERY_ACTIONS.SELECT:
        query2 += querySegment2;
        break;
    }
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
    getPostData,
    QUERY_ACTIONS
}
