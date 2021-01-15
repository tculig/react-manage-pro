import { REACT_APP_MAIN_DATABASE, fetchURL, getBatchJoinedEntities, removeElementDB,
  createElementDB, updateElementDB, selectAllDB, selectElementsDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";
import { propertyTypes } from "../../../utils/Constants";

export async function getLayoutByID(table, id) {
  const layoutData = await fetch(
    `${fetchURL}/getLayoutByID?database=${REACT_APP_MAIN_DATABASE}&table=${table}&id=${id}`
  ).then((response) => {
    return response.json();
  });
  return layoutData;
}

export async function getLayoutWithPropertiesByID(table, id) {
  let layoutData = await fetch(
    `${fetchURL}/getLayoutWithPropertiesByID?database=${REACT_APP_MAIN_DATABASE}&table=${table}&id=${id}`
  ).then((response) => {
    return response.json();
  });
  layoutData = layoutData.map((el) => {
    return {
      ...el,
      static: !!el.static,
      fontConfiguration: JSON.parse(el.fontConfiguration),
      entityDataConfiguration: JSON.parse(el.entityDataConfiguration),
    };
  });
  return layoutData;
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
  entityIds.forEach((el) => {
    groupedResult[el] = [];
  });
  result.forEach((el) => {
    // map property types
    el.property_type = propertyTypes[el.property_type];
    // group properties
    groupedResult[el.entity_type_id].push(el);
  });
  const filledLayout = layout.map((layoutEl) => {
    let edc = groupedResult[layoutEl.entityTypeId];
    edc = edc.map((el) => {
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

export async function getAvailableLayouts(table) {
  const layoutData = await fetch(
    `${fetchURL}/getAvailableLayouts?database=${REACT_APP_MAIN_DATABASE}&table=${table}`
  ).then((response) => {
    return response.json();
  });
  return layoutData;
}

export async function createLayoutDB(table, name, entityTypeId) {
  const insertResponse = await createElementDB(REACT_APP_MAIN_DATABASE, table, {
    name,
    dateCreated: getToday(),
    active: 1,
    entityTypeId,
  });
  const defaultFontConfiguration = {
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    fontSize: 24,
    color: "black",
  };
  const entityTypeProperties = await selectElementsDB(
    REACT_APP_MAIN_DATABASE,
    "entity_type_properties",
    {
      entity_type_id: entityTypeId,
    }
  );
  const foreignKey = `${table}_id`;
  const insertPropertiesResponse = await createElementDB(
    REACT_APP_MAIN_DATABASE,
    `${table}_properties`,
    {
      [foreignKey]: insertResponse.insertId,
      i: "rootBlock",
      x: 60,
      y: 20,
      w: 10,
      h: 10,
      static: 0,
      parent: "root",
      fontConfiguration: JSON.stringify(defaultFontConfiguration),
      entityDataConfiguration: JSON.stringify(
        entityTypeProperties.map((el) => el.id)
      ),
    }
  );
  return [insertResponse, insertPropertiesResponse];
}

export async function removeLayoutDB(table, layoutID) {
  return removeElementDB(REACT_APP_MAIN_DATABASE, table, { id: layoutID });
}

export async function updateLayoutDB(table, modalState) {
  const updateResponse = await updateElementDB(REACT_APP_MAIN_DATABASE, table, {
    id: modalState.loadID,
    name: modalState.fields[0].property_value,
  });
  return updateResponse;
}

export async function getEntityTypesWithProperties(id) {
  const entityTypeData = await fetch(
    `${fetchURL}/getEntityTypesWithProperties?database=${REACT_APP_MAIN_DATABASE}&id=${id}`
  ).then((response) => {
    return response.json();
  });
  return entityTypeData;
}

export async function getAvailableEntityTypes() {
  return selectAllDB(REACT_APP_MAIN_DATABASE, "entity_type");
}
