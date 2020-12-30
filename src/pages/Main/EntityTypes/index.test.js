require("@babel/polyfill");
global.fetch = require("node-fetch");
import { addElementDB, removeElementDB, updateElementDB, selectElementDB } from "../../../nodeJS/Interface";

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
    const responseCreate = await addElementDB("hsvisum2","entities",data);
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
    const responseUpdate = await updateElementDB("hsvisum2","entities",{
        id:responseCreate.insertId,
        ...updateData
    });
    expect(responseUpdate).toMatchObject({affectedRows:1});
    const responseSelect = await selectElementDB("hsvisum2","entities",{id:responseCreate.insertId});
    expect(responseSelect.length).toBe(1);
    expect(responseSelect[0]).toMatchObject(updateData);

    //REMOVE TEST
    const responseDelete = await removeElementDB("hsvisum2","entities",{id:responseCreate.insertId});
    expect(responseDelete).toMatchObject({affectedRows:1});
});