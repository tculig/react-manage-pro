import { REACT_APP_MAIN_DATABASE, fetchURL, removeElementDB, createElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

export async function getTemplateByID(id) {
  const templateData = await fetch(`${fetchURL}/getTemplateByID?databaseID=${REACT_APP_MAIN_DATABASE}&id=${id}`).then(response => { return response.json(); });
  let result = null;
  switch (templateData?.length) {
    case 0:
      console.log("getTemplateByID returned no results!");
      break;
    case 1:
      [result] = templateData;
      result.static = !!result.static;
      break;
    default:
      console.log("More than one result returned in getTemplateByID!");
      break;
  }
  return result;
}

export async function getAvailableTemplates() {
  const templateData = await fetch(`${fetchURL}/getAvailableTemplates?databaseID=${REACT_APP_MAIN_DATABASE}`).then(response => { return response.json(); });
  return templateData;
}

export async function createTemplateDB(name) {
  const insertResponse = createElementDB(REACT_APP_MAIN_DATABASE, "template", {
    name,
    dateCreated: getToday(),
    active: 1
  });
  const insertPropertiesResponse = createElementDB(REACT_APP_MAIN_DATABASE, "template_properties", {
    template_id: insertResponse.insertId,
    i: "rootBlock",
    x: 10,
    y: 10,
    w: 10,
    h: 10,
    static: 0,
    parent: "root",
  });
  return [insertResponse, insertPropertiesResponse];
}

export async function removeTemplateDB(templateID) {
  return removeElementDB(REACT_APP_MAIN_DATABASE, "template_data", { id: templateID });
}

export async function updateTemplateDB(templateID) {
  console.log(templateID);
}
