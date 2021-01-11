const renameKeys = (object, keyMap) => {
  // deep clone the array
  let resultObject = object.map((a) => ({ ...a }));
  resultObject = resultObject.map((obj) => {
    Object.entries(keyMap).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[value] = obj[key];
        delete obj[key];
      }
    });
    return obj;
  });
  return resultObject;
};

const modReducer = (state, mutation) => {
  return { ...state, ...mutation };
};
const getToday = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const nullToUndefined = (dbObj) => {
  const entries = Object.entries(dbObj);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    if (value === null) {
      dbObj[key] = undefined;
    }
  }
  return dbObj;
};

const nullToUndefinedArray = (dbObjArray) => {
  for (let i = 0; i < dbObjArray.length; i++) {
    dbObjArray[i] = nullToUndefined(dbObjArray[i]);
  }
  return dbObjArray;
};

export {
  renameKeys,
  modReducer,
  getToday,
  nullToUndefined,
  nullToUndefinedArray,
};
