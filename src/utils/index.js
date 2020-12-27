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

export {
  renameKeys,
  modReducer,
  getToday
};
