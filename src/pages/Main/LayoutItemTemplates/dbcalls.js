import { REACT_APP_MAIN_DATABASE, selectAllDB } from "../../../nodeJS/Interface";

export async function getAvailableEntityTypes() {
  return selectAllDB(REACT_APP_MAIN_DATABASE, "entity_type");
}
