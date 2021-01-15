export const REACT_APP_MAIN_DATABASE = "hsvisum2";
export const fetchURL = "http://localhost:3009";

export async function forwardPost(database, table, url, data) {
  const host = "http://localhost:3009";
  const obj = {
    method: "POST",
    body: JSON.stringify({
      data,
      table,
      database,
    }),
  };
  try {
    const result = await fetch(`${host}${url}`, obj).then((res) => res.json());
    if (result.errno) {
      console.log("ERROR in forwardPost");
      console.log(result);
    }
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function createElementDB(database, table, data) {
  return forwardPost(database, table, "/createElement", data);
}
export async function createElementsDB(database, table, data) {
  return forwardPost(database, table, "/createElements", data);
}
export async function updateElementDB(database, table, data) {
  return forwardPost(database, table, "/updateElement", data);
}
export async function removeElementDB(database, table, data) {
  return forwardPost(database, table, "/removeElement", data);
}
export async function selectElementsDB(database, table, data) {
  return forwardPost(database, table, "/selectElements", data);
}
export async function selectElementDB(database, table, data) {
  const results = await forwardPost(database, table, "/selectElements", data);
  if (results.length !== 1) {
    console.log("selectElementDB didn't return a unique element!");
  }
  return results[0];
}
export async function selectAllDB(database, table) {
  return forwardPost(database, table, "/selectAll");
}
export async function createTableDB(database, table, data) {
  return forwardPost(database, table, "/createTable", data);
}
export async function dropTableDB(database, table, data) {
  return forwardPost(database, table, "/dropTable", data);
}
export async function getBatchJoinedEntities(database, data) {
  return forwardPost(database, null, "/getBatchJoinedEntities", data);
}
