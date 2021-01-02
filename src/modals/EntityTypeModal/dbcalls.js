import { selectElementDB, REACT_APP_MAIN_DATABASE } from "../../nodeJS/Interface";

export async function getEntityType(loadID) {
  const entityTypeData = await selectElementDB(REACT_APP_MAIN_DATABASE, "entities", { id: loadID });
  if (entityTypeData.length !== 1) {
    return null;
  }
  entityTypeData[0].fields = JSON.parse(entityTypeData[0].fields);
  return entityTypeData[0];
}
