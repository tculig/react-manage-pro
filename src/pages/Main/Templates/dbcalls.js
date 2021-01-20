import { REACT_APP_MAIN_DATABASE, selectAllDB, getBatchJoinedEntityTypes } from "../../../nodeJS/Interface";
import { propertyTypes } from "../../../utils/Constants";

export async function getAvailableEntityTypes() {
  return selectAllDB(REACT_APP_MAIN_DATABASE, "entity_type");
}

// Normally this would be handled by an ORM, but this project is too small for that
// This is also seperate from the similar thing in the HomeView because it is needed to show all possible properties as defined in the
// entity_type selected for the template. In HomeView there is no need to display unused properties and thus a more efficient logic can be used.
// One very important concequence of the way this is setup is that, in order for the value to be displayed, the 'checked' property has to be set to true!
export async function fillEntityDataConfigurationForTemplates(layout) {
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
    el.value = el.property_name;
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
