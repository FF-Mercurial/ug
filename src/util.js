'use strict';

var Set = require('./Set');

exports.assignObj = function (src, dst) {
  var key;
  for (key in src) delete src[key];
  for (key in dst) src[key] = dst[key];
};

exports.unionSet = function (set1, set2) {
  var res = new Set;
  set1.forEach(function (item) {
    res.add(item);
  });
  set2.forEach(function (item) {
    res.add(item);
  });
  return res;
};

exports.cloneObj = function cloneObj(obj) {
  var res, item, key;
  if (obj instanceof Array) {
    res = [];
    for (item of obj) res.push(cloneObj(item));
    return res;
  } else if (typeof obj === 'object' && obj !== null) {
    res = {};
    for (key in obj) res[key] = cloneObj(obj[key]);
      return res;
  } else {
    return obj;
  }
};