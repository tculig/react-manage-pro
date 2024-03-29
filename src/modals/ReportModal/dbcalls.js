import { REACT_APP_MAIN_DATABASE, selectElementDB, createElementDB, updateElementDB, selectAllDB } from "../../nodeJS/Interface";

export async function getReportById(loadID) {
  const reportDetails = await selectElementDB(REACT_APP_MAIN_DATABASE, "reports", { id: loadID });
  return reportDetails;
}

export async function createNewReport(data) {
  const createResponse = await createElementDB(REACT_APP_MAIN_DATABASE, "reports", data);
  return createResponse;
}

export async function updateReport(obj) {
  const createResponse = await updateElementDB(REACT_APP_MAIN_DATABASE, "reports", obj);
  return createResponse;
}

export async function getReportTypes() {
  const reportTypes = await selectAllDB(REACT_APP_MAIN_DATABASE, "report_types");
  return reportTypes;
}
