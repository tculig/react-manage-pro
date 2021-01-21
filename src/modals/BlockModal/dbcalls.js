import { fetchURL, REACT_APP_MAIN_DATABASE } from "../../nodeJS/Interface";

export async function getEntityReports(entityId) {
  const entityPropertyArray = await fetch(`${fetchURL}/getEntityReports?database=${REACT_APP_MAIN_DATABASE}&id=${entityId}`)
    .then(response => { return response.json(); });
  return entityPropertyArray;
}
