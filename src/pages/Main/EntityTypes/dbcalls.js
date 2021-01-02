import { REACT_APP_MAIN_DATABASE, addElementsDB, addElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

export async function createEntityTypeDB(entityName, entityFieldsRaw) {
  const insertEntityType = await addElementDB(REACT_APP_MAIN_DATABASE, "entity_type", {
    name: entityName,
    dateCreated: getToday()
  });
  if (insertEntityType.serverStatus !== 2) return null;
  const propertiesArray = [];
  for (let i = 0; i < entityFieldsRaw.length; i++) {
    propertiesArray.push({
      entity_type_id: insertEntityType.insertId,
      property_name: entityFieldsRaw[i].fieldName,
      property_type: entityFieldsRaw[i].fieldType.value
    });
  }
  const insertEntityTypeProperties = await addElementsDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", propertiesArray);
  if (insertEntityTypeProperties.serverStatus !== 2) return null;
  return insertEntityTypeProperties;
}

export async function updateEntityTypeDB(entityName, entityFieldsRaw) {
  console.log(entityName);
  console.log(entityFieldsRaw);
}

export async function getAvailableEntities() {
  return null;
}
