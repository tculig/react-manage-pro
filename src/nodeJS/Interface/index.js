const host = "http://localhost:3009";

function forwardPost(databaseID, tableID, url, data, callback) {
  const obj = {
    method: "POST",
    body: JSON.stringify({
      data,
      tableID,
      databaseID,
    }),
  };
  fetch(url, obj)
    .then((responseJSON) => responseJSON.json())
    .then((response) => {
      if (callback) {
        if (response.errno) callback(false);
        else callback(response);
      }
    });
}

export function addElementDB(database, table, data, callback) {
  forwardPost(database, table, `${host}/addElement`, data, callback);
}
export function updateElementDB(database, table, data, callback) {
  forwardPost(database, table, `${host}/updateElement`, data, callback);
}
export function removeElementDB(database, table, data, callback) {
  forwardPost(database, table, `${host}/removeElement`, data, callback);
}
export function createEntityTypeDB(database, table, data, callback) {
  forwardPost(database, table, `${host}/createEntityTypeTable`, data, (response) => {
    if (response === false) {
      callback({ error: "Entity could not be created." });
    } else {
      forwardPost(database, table, `${host}/addElement`, data, callback);
    }
  });
}
