'use strict';

exports.assignObj = (src, dst) => {
  for (let key in src) delete src[key];
  for (let key in dst) src[key] = dst[key];
};

exports.unionSet = (set1, set2) => {
  let res = new Set;
  for (let item of set1) res.add(item);
  for (let item of set2) res.add(item);
  return res;
};

exports.cloneObj = function cloneObj(obj) {
  if (obj instanceof Array) {
    let res = [];
    for (let item of obj) res.push(cloneObj(item));
    return res;
  } else if (typeof obj === 'object' && obj !== null) {
    let res = {};
    for (let key in obj) res[key] = cloneObj(obj[key]);
      return res;
  } else {
    return obj;
  }
};
