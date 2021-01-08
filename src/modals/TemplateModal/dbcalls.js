import { selectElementDB, REACT_APP_MAIN_DATABASE } from "../../nodeJS/Interface";

export async function getTemplateData(loadID) {
  return selectElementDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", { entity_type_id: loadID });
}
