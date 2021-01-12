import { selectElementsDB, REACT_APP_MAIN_DATABASE } from "../../nodeJS/Interface";

export async function getEntityTypeProperties(loadID) {
  return selectElementsDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", { entity_type_id: loadID });
}
