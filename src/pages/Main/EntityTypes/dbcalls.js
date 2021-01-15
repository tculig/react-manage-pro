import { REACT_APP_MAIN_DATABASE, fetchURL, createElementsDB, createElementDB, removeElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

export async function createEntityTypeDB(entityTypeName, entityFieldsRaw) {
  const insertEntityType = await createElementDB(REACT_APP_MAIN_DATABASE, "entity_type", {
    name: entityTypeName,
    dateCreated: getToday(),
    active: 1
  });
  const propertiesArray = [];
  for (let i = 0; i < entityFieldsRaw.length; i++) {
    if (entityFieldsRaw[i].property_name !== "") {
      propertiesArray.push({
        entity_type_id: insertEntityType.insertId,
        property_name: entityFieldsRaw[i].property_name,
        property_type: entityFieldsRaw[i].property_type.value,
        editable: entityFieldsRaw[i].editable
      });
    }
  }
  const insertEntityTypeProperties = await createElementsDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", propertiesArray);
  return [insertEntityType, insertEntityTypeProperties];
}

export async function removeEntityTypeDB(entityTypeID) {
  return removeElementDB(REACT_APP_MAIN_DATABASE, "entity_type", { id: entityTypeID });
}

export async function updateEntityTypeDB(entityName, entityFieldsRaw) {
  console.log(entityName);
  console.log(entityFieldsRaw);
}

export async function getAvailableEntityTypesWithFieldCount() {
  const availableEntityTypes = await fetch(`${fetchURL}/getAvailableEntityTypesWithFieldCount?database=${REACT_APP_MAIN_DATABASE}`).then(response => { return response.json(); });
  return availableEntityTypes;
}
