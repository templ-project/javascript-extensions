const sortByKeys = (obj) => {
  let keys = Object.getOwnPropertyNames(obj).sort();
  const newObj = {};
  for (key of keys) {
    if (typeof obj[key] !== 'object' && !Array.isArray(obj[key])) {
      newObj[key] = obj[key];
    } else {
      newObj[key] = sortByKeys(obj[key]);
    }
  }
  return newObj;
};

const removeKeys = (obj, keys) => {
  const newObj = {};
  const okeys = Object.getOwnPropertyNames(obj).filter((key) => keys.find((lkey) => lkey === key));
  for (const okey of okeys) {
    newObj[okey] = obj[okey];
  }
  return newObj;
};

module.exports = {
  sortByKeys,
  removeKeys,
}
