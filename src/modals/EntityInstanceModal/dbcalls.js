import { fetchURL, selectElementsDB, REACT_APP_MAIN_DATABASE } from "../../nodeJS/Interface";

export async function getEntityTypeProperties(loadID) {
  return selectElementsDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", { entity_type_id: loadID });
}

export async function getEntityPropertiesById(loadID) {
  const entityPropertyArray = await fetch(`${fetchURL}/getEntityEntryWithPropertiesById?database=${REACT_APP_MAIN_DATABASE}&id=${loadID}`)
    .then(response => { return response.json(); });
  return entityPropertyArray;
}
