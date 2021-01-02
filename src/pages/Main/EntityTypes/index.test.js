require("@babel/polyfill");
global.fetch = require("node-fetch");
import {
  addElementDB,
  removeElementDB,
  updateElementDB,
  selectElementDB,
  dropTableDB,
  REACT_APP_ENTITIES_DATABASE,
  REACT_APP_MAIN_DATABASE,
  getAvailableEntities
} from "../../../nodeJS/Interface";
import { createEntityTypeDB } from "./dbcalls";

test("Add, update and remove entity test", async () => {
    //ADD TEST
    const data = {
        name: "testName",
        fields: JSON.stringify({
            field1:"field1Content",
            field2:"field2Content"
        }),
        active: 1,
        dateCreated: "2020-11-11"
    };
    const responseCreate = await addElementDB(REACT_APP_MAIN_DATABASE,"entities",data);
    expect(responseCreate).toMatchObject({affectedRows:1});

    //UPDATE TEST
    const updateData = {
        name: "changedName",
        fields: JSON.stringify({
            field1:"changedField1Content",
            field2:"changedDield2Content"
        }),
        active: 0,
        dateCreated: "2010-10-10"
    }
    const responseUpdate = await updateElementDB(REACT_APP_MAIN_DATABASE,"entities",{
        id:responseCreate.insertId,
        ...updateData
    });
    expect(responseUpdate).toMatchObject({affectedRows:1});
    const responseSelect = await selectElementDB(REACT_APP_MAIN_DATABASE,"entities",{id:responseCreate.insertId});
    expect(responseSelect.length).toBe(1);
    expect(responseSelect[0]).toMatchObject(updateData);

    //REMOVE TEST
    const responseDelete = await removeElementDB(REACT_APP_MAIN_DATABASE,"entities",{id:responseCreate.insertId});
    expect(responseDelete).toMatchObject({affectedRows:1});
});

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
    const createTableResponse = await createEntityTypeDB(entityName, fields);
    expect(createTableResponse).toMatchObject({serverStatus:2});

    const availableEntities = await getAvailableEntities();
    expect(availableEntities.length>0).toBe(true);
    expect(availableEntities[0]).toHaveProperty("activeEntries");

    //DELETE THE CREATED TABLE
    const dropTableResponse = await dropTableDB(REACT_APP_ENTITIES_DATABASE, entityName);
    expect(dropTableResponse).toMatchObject({serverStatus:2});

    //DELETE THE TRACKING ENTRY
    const responseDelete = await removeElementDB(REACT_APP_MAIN_DATABASE,"entities",{id:createTableResponse.insertId});
    expect(responseDelete).toMatchObject({affectedRows:1});
})
