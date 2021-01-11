import { REACT_APP_MAIN_DATABASE, fetchURL, removeElementDB, createElementDB, updateElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

export async function getTemplateByID(id) {
  const templateData = await fetch(`${fetchURL}/getTemplateByID?databaseID=${REACT_APP_MAIN_DATABASE}&id=${id}`).then(response => { return response.json(); });
  switch (templateData?.length) {
    case 0:
      console.log("getTemplateByID returned no results!");
      break;
    case 1:
      templateData[0].static = !!templateData[0].static;
      break;
    default:
      console.log("More than one result returned in getTemplateByID!");
      break;
  }
  return templateData;
}

export async function getTemplateWithPropertiesByID(id) {
  const templateData = await fetch(`${fetchURL}/getTemplateWithPropertiesByID?databaseID=${REACT_APP_MAIN_DATABASE}&id=${id}`).then(response => { return response.json(); });
  switch (templateData?.length) {
    case 0:
      console.log("getTemplateWithPropertiesByID returned no results!");
      break;
    case 1:
      templateData[0].static = !!templateData[0].static;
      templateData[0].fontConfiguration = JSON.parse(templateData[0].fontConfiguration);
      break;
    default:
      console.log("More than one result returned in getTemplateWithPropertiesByID!");
      break;
  }
  return templateData;
}

export async function getAvailableTemplates() {
  const templateData = await fetch(`${fetchURL}/getAvailableTemplates?databaseID=${REACT_APP_MAIN_DATABASE}`).then(response => { return response.json(); });
  return templateData;
}

export async function createTemplateDB(name) {
  const insertResponse = await createElementDB(REACT_APP_MAIN_DATABASE, "template", {
    name,
    dateCreated: getToday(),
    active: 1
  });
  const defaultFontConfiguration = {
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    fontSize: 24,
    color: "black"
  };
  const insertPropertiesResponse = await createElementDB(REACT_APP_MAIN_DATABASE, "template_properties", {
    template_id: insertResponse.insertId,
    i: "rootBlock",
    x: 60,
    y: 20,
    w: 10,
    h: 10,
    static: 0,
    parent: "root",
    fontConfiguration: JSON.stringify(defaultFontConfiguration)
  });
  return [insertResponse, insertPropertiesResponse];
}

export async function removeTemplateDB(templateID) {
  return removeElementDB(REACT_APP_MAIN_DATABASE, "template", { id: templateID });
}

export async function updateTemplateDB(modalState) {
  const updateResponse = await updateElementDB(REACT_APP_MAIN_DATABASE, "template", {
    id: modalState.loadID,
    name: modalState.fields[0].property_value
  });
  return updateResponse;
}
