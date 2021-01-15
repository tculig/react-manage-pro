const debug = true;

function daisyChainGet(connectionObj, query, callback) {
  if(debug) console.log(query);
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

function constructQuery(database, table, availableFields, object, action) {
  let query = "";
  switch(action){
    case QUERY_ACTIONS.INSERT: query = "INSERT INTO `" + database + "`.`" + table + "` ";break;
    case QUERY_ACTIONS.UPDATE: query = "UPDATE `" + database + "`.`" + table + "` SET ";break;
    case QUERY_ACTIONS.SELECT: query = "SELECT * FROM `" + database + "`.`" + table + "` WHERE ";break;
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
      for (let k = 0; k < availableFields.length; k++) {
        if (availableFields[k].Field == key) contains = true;
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
      query += querySegment1;
      query += querySegment2;
      break;
    case QUERY_ACTIONS.UPDATE:
      query += querySegment2;
      query += " WHERE `id`='" + object.id + "'";
      break;
    case QUERY_ACTIONS.SELECT:
      query += querySegment2;
      break;
  }
  query+=";";  
  return query;
}

function runMultiQueryFromObject(connection, database, table, objectArray, action, callback){
  let queryAvailableFields = "SHOW COLUMNS FROM `" + database + "`.`" + table + "`";
  connection.query(queryAvailableFields, [objectArray], function (errorAvailableFields, availableFields) {
    if (errorAvailableFields) console.log(errorAvailableFields);
    let query = "";
    for(let i=0; i<objectArray.length; i++ ){
      query += constructQuery(database, table, availableFields, objectArray[i], action); 
    }
    if(debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) {
        if (callback) callback(error);
      } else {
        if (callback) callback(results);
      }
    });
  });
}

function runQueryFromObject(connection, database, table, object, action, callback) {
  let queryAvailableFields = "SHOW COLUMNS FROM `" + database + "`.`" + table + "`";
  connection.query(queryAvailableFields, [object], function (errorAvailableFields, availableFields) {
    if (errorAvailableFields) console.log(errorAvailableFields);
    const query = constructQuery(database, table, availableFields, object, action); 
    if(debug) console.log(query);
    connection.query(query, function (error, results, fields) {
      if (error) {
        if (callback) callback(error);
      } else {
        if (callback) callback(results);
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
    runMultiQueryFromObject,
    runQueryFromObject,
    getPostData,
    QUERY_ACTIONS
}
