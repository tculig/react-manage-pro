import { REACT_APP_MAIN_DATABASE, createElementDB } from "../../nodeJS/Interface";

export async function createBlockDB(templateId, layoutId, layoutElement) {
  const insertResponse = await createElementDB(
    REACT_APP_MAIN_DATABASE,
    "layout_properties",
    {
      ...layoutElement,
      layout_id: layoutId,
      template_id: templateId,
      type: "block"
    }
  );
  return insertResponse;
}
