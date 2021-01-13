import { REACT_APP_MAIN_DATABASE, fetchURL, getBatchJoinedEntities, removeElementDB, createElementDB, updateElementDB, selectAllDB, selectElementsDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";
import { propertyTypes } from "../../../utils/Constants";

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
      templateData[0].entityDataConfiguration = JSON.parse(templateData[0].entityDataConfiguration);
      break;
    default:
      console.log("More than one result returned in getTemplateWithPropertiesByID!");
      break;
  }
  return templateData;
}
// Normally this would be handled by an ORM, but this project is too small for that
export async function fillEntityDataConfiguration(layout) {
  const entityIds = [];
  for (let i = 0; i < layout.length; i++) {
    if (!entityIds.includes(layout[i].entityTypeId)) {
      entityIds.push(layout[i].entityTypeId);
    }
  }
  const result = await getBatchJoinedEntities(
    REACT_APP_MAIN_DATABASE,
    entityIds
  );
  const groupedResult = {};
  entityIds.forEach(el => {
    groupedResult[el] = [];
  });
  result.forEach(el => {
    // map property types
    el.property_type = propertyTypes[el.property_type];
    // group properties
    groupedResult[el.entity_type_id].push(el);
  });
  const filledLayout = layout.map(layoutEl => {
    let edc = groupedResult[layoutEl.entityTypeId];
    edc = edc.map(el => {
      if (layoutEl.entityDataConfiguration.includes(el.id)) {
        el.checked = true;
      } else {
        el.checked = false;
      }
      return el;
    });
    layoutEl.entityDataConfiguration = edc;
    return layoutEl;
  });
  return filledLayout;
}

export async function getAvailableTemplates() {
  const templateData = await fetch(`${fetchURL}/getAvailableTemplates?databaseID=${REACT_APP_MAIN_DATABASE}`).then(response => { return response.json(); });
  return templateData;
}

export async function createTemplateDB(name, entityTypeId) {
  const insertResponse = await createElementDB(REACT_APP_MAIN_DATABASE, "template", {
    name,
    dateCreated: getToday(),
    active: 1,
    entityTypeId
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
  const entityTypeProperties = await selectElementsDB(REACT_APP_MAIN_DATABASE, "entity_type_properties", {
    entity_type_id: entityTypeId
  });
  const insertPropertiesResponse = await createElementDB(REACT_APP_MAIN_DATABASE, "template_properties", {
    template_id: insertResponse.insertId,
    i: "rootBlock",
    x: 60,
    y: 20,
    w: 10,
    h: 10,
    static: 0,
    parent: "root",
    fontConfiguration: JSON.stringify(defaultFontConfiguration),
    entityDataConfiguration: JSON.stringify(entityTypeProperties.map(el => el.id))
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

export async function getEntityTypesWithProperties(id) {
  const entityTypeData = await fetch(`${fetchURL}/getEntityTypesWithProperties?databaseID=${REACT_APP_MAIN_DATABASE}&id=${id}`)
    .then(response => { return response.json(); });
  return entityTypeData;
}

export async function getAvailableEntityTypes() {
  return selectAllDB(REACT_APP_MAIN_DATABASE, "entity_type");
}
