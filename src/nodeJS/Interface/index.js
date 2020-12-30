const host = "http://localhost:3009";

async function forwardPost(databaseID, tableID, url, data) {
  const obj = {
    method: "POST",
    body: JSON.stringify({
      data,
      tableID,
      databaseID,
    }),
  };
  try {
    const result = await fetch(url, obj).then((res) => res.json());
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function addElementDB(database, table, data) {
  return forwardPost(database, table, `${host}/addElement`, data);
}
export async function updateElementDB(database, table, data) {
  return forwardPost(database, table, `${host}/updateElement`, data);
}
export async function removeElementDB(database, table, data) {
  return forwardPost(database, table, `${host}/removeElement`, data);
}
export async function selectElementDB(database, table, data) {
  return forwardPost(database, table, `${host}/selectElement`, data);
}
export async function createEntityTypeDB(database, table, data) {
  const response = await forwardPost(database, table, `${host}/createEntityTypeTable`, data);
  let result = null;
  if (response.errno) {
    result = ({ error: "Entity could not be created." });
  } else {
    result = response;
    // forwardPost(database, table, `${host}/addElement`, data);
  }
  return result;
}
