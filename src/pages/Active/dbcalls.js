import { REACT_APP_MAIN_DATABASE, selectAllDB, getJoinedReportsByTypes } from "../../nodeJS/Interface";

export async function getReportsByType(reportTypes) {
  const reportIds = reportTypes.filter((el) => el.checked).map((el) => el.id);
  if (reportIds.length > 0) {
    const entityReports = await getJoinedReportsByTypes(REACT_APP_MAIN_DATABASE, {
      values: reportIds,
    });
    return entityReports;
  }
  return [];
}

export async function getReportTypes() {
  const reportTypes = await selectAllDB(REACT_APP_MAIN_DATABASE, "report_types");
  return reportTypes;
}
