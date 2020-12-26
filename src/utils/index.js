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

export default { renameKeys };
