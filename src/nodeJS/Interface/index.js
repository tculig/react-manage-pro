export const REACT_APP_MAIN_DATABASE = "hsvisum2";

export async function forwardPost(databaseID, tableID, url, data) {
  const host = "http://localhost:3009";
  const obj = {
    method: "POST",
    body: JSON.stringify({
      data,
      tableID,
      databaseID,
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

export async function addElementDB(database, table, data) {
  return forwardPost(database, table, "/addElement", data);
}
export async function addElementsDB(database, table, data) {
  return forwardPost(database, table, "/addElements", data);
}
export async function updateElementDB(database, table, data) {
  return forwardPost(database, table, "/updateElement", data);
}
export async function removeElementDB(database, table, data) {
  return forwardPost(database, table, "/removeElement", data);
}
export async function selectElementDB(database, table, data) {
  return forwardPost(database, table, "/selectElement", data);
}
export async function selectAllDB(database, table, data) {
  return forwardPost(database, table, "/selectAll", data);
}
export async function createTableDB(database, table, data) {
  return forwardPost(database, table, "/createTable", data);
}
export async function dropTableDB(database, table, data) {
  return forwardPost(database, table, "/dropTable", data);
}
