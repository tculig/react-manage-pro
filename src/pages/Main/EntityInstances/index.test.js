require("@babel/polyfill");
global.fetch = require("node-fetch");
import {
  removeElementDB,
  REACT_APP_MAIN_DATABASE,
  getAvailableEntities
} from "../../../nodeJS/Interface";
import { createEntityTypeDB } from "./dbcalls";

test("Create entity table test, Get available entities.", async () => {
    const entityName = "JestEntity"
    const fields = [
      {
        fieldName: "Name",
        disabled: true,
        fieldType: { value: "TEXT", label: "Text" },
      },
      {
        fieldName: "f1",
        disabled: false,
        fieldType: { value: "INT", label: "Integer" },
      },
      {
        fieldName: "f2",
        disabled: false,
        fieldType: { value: "DECIMAL(10,2)", label: "Decimal" },
      },
      {
        fieldName: "f3",
        disabled: false,
        fieldType: { value: "DATE", label: "Date" },
      },
    ];
    //CREATE TABLE AND INSERT ENTRY INTO TRACKING 
    const [insertEntityType, insertEntityTypeProperties] = await createEntityTypeDB(entityName, fields);
    expect(insertEntityType).toMatchObject({affectedRows:1});
    insertEntityTypeProperties.forEach(element=>{
      expect(element).toMatchObject({affectedRows:1});
    });
  
    /*const availableEntities = await getAvailableEntities();
    expect(availableEntities.length>0).toBe(true);
    expect(availableEntities[0]).toHaveProperty("activeEntries");*/

    //DELETE THE TRACKING ENTRY
    const responseDelete = await removeElementDB(REACT_APP_MAIN_DATABASE,"entity_type",{id:insertEntityType.insertId});
    expect(responseDelete).toMatchObject({affectedRows:1});
})
