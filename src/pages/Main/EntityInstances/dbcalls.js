import { fetchURL, REACT_APP_MAIN_DATABASE, createElementsDB, createElementDB, removeElementDB, selectElementsDB, selectAllDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

export async function createEntityInstanceDB(entityInstanceData) {
  const insertEntityInstance = await createElementDB(REACT_APP_MAIN_DATABASE, "entity", {
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
  const insertEntityProperties = await createElementsDB(REACT_APP_MAIN_DATABASE, "entity_properties", propertiesArray);
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
  const availableEntityTypes = await selectAllDB(REACT_APP_MAIN_DATABASE, "entity_type");
  return availableEntityTypes || [];
}

export async function getEntityTypeProperties(entityTypeId) {
  const entityTypeProperties = await selectElementsDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", {
    entity_type_id: entityTypeId
  });
  return entityTypeProperties;
}

export async function getEntityEntriesWithProperties(entityTypeId) {
  const entityTypeEntries = await fetch(`${fetchURL}/getEntityEntriesWithProperties?database=${REACT_APP_MAIN_DATABASE}&entity_type_id=${entityTypeId}`)
    .then(response => { return response.json(); });
  return entityTypeEntries;
}
