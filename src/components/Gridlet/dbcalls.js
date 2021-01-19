import { REACT_APP_MAIN_DATABASE, createElementDB, selectElementDB, updateElementDB } from "../../nodeJS/Interface";

export async function createBlockDB(templateId, layoutId, layoutElement) {
  const templateReponse = await selectElementDB(REACT_APP_MAIN_DATABASE, "template_properties", { layout_id: templateId });
  const insertResponse = await createElementDB(
    REACT_APP_MAIN_DATABASE,
    "layout_properties",
    {
      ...layoutElement,
      layout_id: layoutId,
      template_id: templateId,
      type: "block",
      w: templateReponse.w,
      h: templateReponse.h
    }
  );
  return insertResponse;
}

export async function connectEntityToBlockDB(layoutElementId, entityId) {
  const response = await updateElementDB(REACT_APP_MAIN_DATABASE, "layout_properties", {
    id: layoutElementId,
    entity_id: entityId
  });
  return response;
}
