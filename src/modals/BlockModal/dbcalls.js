import { REACT_APP_MAIN_DATABASE, selectElementsDB } from "../../nodeJS/Interface";

export async function getEntityReports(entityId) {
  const entityReports = await selectElementsDB(REACT_APP_MAIN_DATABASE, "reports", { entityId });
  return entityReports;
}
