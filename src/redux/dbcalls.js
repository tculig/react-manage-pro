import { REACT_APP_MAIN_DATABASE, updateElementDB } from "../nodeJS/Interface";
import { processToDBLayoutEntry } from "../pages/Main/HomeView/dbcalls";

export async function commitLayoutToDB(table, layout) {
  for (let i = 0; i < layout.length; i++) {
    let element = JSON.parse(JSON.stringify(layout[i]));
    if (element.modified) {
      element.entityDataConfiguration = element.entityDataConfiguration.filter(el => el.checked).map(el => el.id);
      element = processToDBLayoutEntry(element);
      console.log(element);
      updateElementDB(REACT_APP_MAIN_DATABASE, table, element);
    }
  }
}
