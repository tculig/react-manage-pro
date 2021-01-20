import { REACT_APP_MAIN_DATABASE, selectElementDB } from "../../nodeJS/Interface";

export async function getReportById(loadID) {
  const reportDetails = await selectElementDB(REACT_APP_MAIN_DATABASE, "reports", { id: loadID });
  return reportDetails;
}
