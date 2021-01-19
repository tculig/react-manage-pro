import { createElementDB, fetchURL, REACT_APP_MAIN_DATABASE, removeElementDB, getBatchJoinedEntityTypes,
  getBatchTemplateProperties, selectAllDB, selectElementsDB, updateElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";
import { propertyTypes } from "../../../utils/Constants";

function processFromDBLayoutEntry(el) {
  return {
    ...el,
    static: !!el.static,
    fontConfiguration: JSON.parse(el.fontConfiguration),
    entityDataConfiguration: JSON.parse(el.entityDataConfiguration),
  };
}

export function processToDBLayoutEntry(el) {
  return {
    ...el,
    fontConfiguration: JSON.stringify(el.fontConfiguration),
    entityDataConfiguration: JSON.stringify(el.entityDataConfiguration),
  };
}

export async function getLayoutByID(table, id) {
  const layoutData = await fetch(
    `${fetchURL}/getLayoutByID?database=${REACT_APP_MAIN_DATABASE}&table=${table}&id=${id}`
  ).then((response) => {
    return response.json();
  });
  return layoutData;
}

export async function getLayoutPropertiesByID(table, id) {
  const layoutProperties = await selectElementsDB(REACT_APP_MAIN_DATABASE, `${table}_properties`, {
    layout_id: id,
  });
  return layoutProperties;
}

export async function getLayoutWithPropertiesByID(table, id) {
  let layoutData = await fetch(`${fetchURL}/getLayoutWithPropertiesByID?database=${REACT_APP_MAIN_DATABASE}&table=${table}&id=${id}`).then((response) => {
    return response.json();
  });
  layoutData = layoutData.map((el) => {
    return processFromDBLayoutEntry(el);
  });
  return layoutData;
}

export async function createLayoutDB(table, name, entityTypeId) {
  const insertResponse = await createElementDB(REACT_APP_MAIN_DATABASE, table, {
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
    color: "black",
  };
  const entityTypeProperties = await selectElementsDB(
    REACT_APP_MAIN_DATABASE,
    "entity_type_properties",
    {
      entity_type_id: entityTypeId,
    }
  );
  const insertPropertiesResponse = await createElementDB(
    REACT_APP_MAIN_DATABASE,
    `${table}_properties`,
    processToDBLayoutEntry({
      layout_id: insertResponse.insertId,
      i: "rootBlock",
      x: 60,
      y: 20,
      w: 10,
      h: 10,
      static: 0,
      parent: "root",
      type: "block",
      entityTypeId,
      fontConfiguration: defaultFontConfiguration,
      entityDataConfiguration: entityTypeProperties.map((el) => el.id),
    })
  );
  return [insertResponse, insertPropertiesResponse];
}

// Normally this would be handled by an ORM, but this project is too small for that
export async function fillTemplateData(layout) {
  const templateIds = [];
  for (let i = 0; i < layout.length; i++) {
    if (!templateIds.includes(layout[i].template_id)) {
      templateIds.push(layout[i].template_id);
    }
  }
  const result = await getBatchTemplateProperties(
    REACT_APP_MAIN_DATABASE,
    templateIds
  );
  const objOfTemplates = {};
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    objOfTemplates[el.layout_id] = el;
  }
  const filledLayout = layout.map((layoutEl) => {
    if (layoutEl.template_id === null) return layoutEl;
    const edc = objOfTemplates[layoutEl.template_id];
    let mod = {
      ...edc,
      x: layoutEl.x,
      y: layoutEl.y,
      w: layoutEl.w,
      h: layoutEl.h,
      type: layoutEl.type,
      id: layoutEl.id,
      layout_id: layoutEl.layout_id,
      static: layoutEl.static,
      parent: layoutEl.parent,
    };
    mod = processFromDBLayoutEntry(mod);
    return mod;
  });
  return filledLayout;
}

// Normally this would be handled by an ORM, but this project is too small for that
export async function fillEntityDataConfiguration(layout) {
  const entityIds = [];
  for (let i = 0; i < layout.length; i++) {
    if (!entityIds.includes(layout[i].entityTypeId)) {
      entityIds.push(layout[i].entityTypeId);
    }
  }
  const result = await getBatchJoinedEntityTypes(REACT_APP_MAIN_DATABASE, entityIds);
  const groupedResult = {};
  for (let i = 0; i < entityIds.length; i++) {
    groupedResult[entityIds[i]] = [];
  }
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    // map property types
    el.property_type = propertyTypes[el.property_type];
    // group properties
    groupedResult[el.entity_type_id].push(el);
  }
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

export async function getAvailableLayouts(table) {
  return selectAllDB(REACT_APP_MAIN_DATABASE, table);
}
