import { createElementDB, fetchURL, REACT_APP_MAIN_DATABASE, removeElementDB,
  getBatchProperties, selectAllDB, selectElementsDB, updateElementDB } from "../../../nodeJS/Interface";
import { getToday } from "../../../utils";

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
  const result = await getBatchProperties(REACT_APP_MAIN_DATABASE, "template_properties", {
    key: "layout_id",
    values: templateIds
  });
  const objOfTemplates = {};
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    objOfTemplates[el.layout_id] = el;
  }
  const filledLayout = layout.map((layoutEl) => {
    if (layoutEl.template_id === null) return layoutEl;
    const edc = objOfTemplates[layoutEl.template_id];
    // take all the properties from layout element, overwrite overlaping ones with template, then revert to the specific ones from the layout element
    let mod = {
      ...layoutEl,
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
// runs through the entire layout and only fills in the ones that don't entity_id filled in
// One very important concequence of the way this is setup is that, in order for the value to be displayed, the 'checked' property has to be set to true!
async function fillEntityDataConfigurationFromTemplate(layout) {
  const entityPropertyIds = [];
  for (let i = 0; i < layout.length; i++) {
    const { entityDataConfiguration } = layout[i];
    if (!layout[i].entity_id) {
      for (let j = 0; j < entityDataConfiguration.length; j++) {
        if (!entityPropertyIds.includes(entityDataConfiguration[j])) {
          entityPropertyIds.push(entityDataConfiguration[j]);
        }
      }
    }
  }
  if (entityPropertyIds.length > 0) {
    const result = await getBatchProperties(REACT_APP_MAIN_DATABASE, "entity_type_properties", {
      key: "id",
      values: entityPropertyIds
    });
    if (result) {
      const groupedResult = {};
      for (let i = 0; i < result.length; i++) {
        const el = result[i];
        el.value = el.property_name;
        el.checked = true;
        groupedResult[el.id] = el;
      }
      const filledLayout = layout.map((layoutEl) => {
        layoutEl.entityDataConfiguration = layoutEl.entityDataConfiguration.map((el) => {
          return groupedResult[el];
        });
        return layoutEl;
      });
      return filledLayout;
    }
  }
  return layout;
}
// runs through the entire layout and only fills in the ones that have entity_id filled in
async function fillEntityDataConfigurationFromEntity(layout) {
  const entityPropertyIds = [];
  for (let i = 0; i < layout.length; i++) {
    const { entityDataConfiguration } = layout[i];
    if (layout[i].entity_id) {
      for (let j = 0; j < entityDataConfiguration.length; j++) {
        if (!entityPropertyIds.includes(entityDataConfiguration[j])) {
          entityPropertyIds.push(entityDataConfiguration[j]);
        }
      }
    }
  }
  if (entityPropertyIds.length > 0) {
    const result = await getBatchProperties(REACT_APP_MAIN_DATABASE, "entity_properties", {
      key: "entity_type_property_id",
      values: entityPropertyIds
    });
    if (result) {
      const groupedResult = {};
      for (let i = 0; i < result.length; i++) {
        const el = result[i];
        el.value = el.property_value;
        el.checked = true;
        groupedResult[el.entity_type_property_id] = el;
      }
      const filledLayout = layout.map((layoutEl) => {
        layoutEl.entityDataConfiguration = layoutEl.entityDataConfiguration.map((el) => {
          return groupedResult[el];
        });
        layoutEl.hasEntity = true; // a helper boolean
        return layoutEl;
      });
      return filledLayout;
    }
  }
  return layout;
}

async function fillHasReportsFromEntity(layout) {
  const entityIds = [];
  for (let i = 0; i < layout.length; i++) {
    if (layout[i].entity_id) {
      entityIds.push(layout[i].entity_id);
    }
  }
  if (entityIds.length > 0) {
    const result = await getBatchProperties(REACT_APP_MAIN_DATABASE, "reports", {
      key: "entityId",
      values: entityIds
    });
    if (result) {
      const groupedResult = {};
      for (let i = 0; i < result.length; i++) {
        const el = result[i];
        if (el.active) {
          groupedResult[el.entityId] = true;
        }
      }
      const filledLayout = layout.map((layoutEl) => {
        layoutEl.hasReports = groupedResult[layoutEl.entity_id]; // a helper boolean
        return layoutEl;
      });
      return filledLayout;
    }
  }
  return layout;
}

export async function fillEntityDataConfiguration(layout) {
  layout = await fillEntityDataConfigurationFromTemplate(layout);
  layout = await fillEntityDataConfigurationFromEntity(layout);
  layout = await fillHasReportsFromEntity(layout);
  return layout;
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
