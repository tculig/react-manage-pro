import { REACT_APP_MAIN_DATABASE, fetchURL, addElementsDB, addElementDB, removeElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

export async function createEntityInstanceDB(entityInstanceData) {
  const insertEntityInstance = await addElementDB(REACT_APP_MAIN_DATABASE, "entity", {
    entity_type_id: entityInstanceData.entityTypeId,
    dateCreated: getToday(),
    active: 1
  });
  const propertiesArray = [];
  const { fields } = entityInstanceData;
  for (let i = 0; i < fields.length; i++) {
    propertiesArray.push({
      entity_id: insertEntityInstance.insertId,
      entity_type_property_id: fields[i].id,
      property_value: fields[i].property_value,
    });
  }
  const insertEntityProperties = await addElementsDB(REACT_APP_MAIN_DATABASE, "entity_properties", propertiesArray);
  return [insertEntityInstance, insertEntityProperties];
}

export async function removeEntityTypeDB(entityTypeID) {
  return removeElementDB(REACT_APP_MAIN_DATABASE, "entity_type", { id: entityTypeID });
}

export async function updateEntityTypeDB(entityName, entityFieldsRaw) {
  console.log(entityName);
  console.log(entityFieldsRaw);
}

export async function getAvailableEntityTypes() {
  const availableEntityTypes = await fetch(`${fetchURL}/getAvailableEntityTypes?databaseID=${REACT_APP_MAIN_DATABASE}`).then(response => { return response.json(); });
  return availableEntityTypes;
}

export async function getEntityTypeProperties(entityTypeId) {
  const entityTypeProperties = await fetch(`${fetchURL}/getEntityTypeProperties?databaseID=${REACT_APP_MAIN_DATABASE}&entity_type_id=${entityTypeId}`)
    .then(response => { return response.json(); });
  return entityTypeProperties;
}

export async function getEntityTypeEntries(entityTypeId) {
  const entityTypeEntries = await fetch(`${fetchURL}/getEntityTypeEntries?databaseID=${REACT_APP_MAIN_DATABASE}&entity_type_id=${entityTypeId}`)
    .then(response => { return response.json(); });
  return entityTypeEntries;
}
