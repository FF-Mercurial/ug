'use strict';

var config = require('./config');

var nextId = 0;

exports.next = function () {
  return config.prefix + nextId++;
};

exports.init = function () {
  nextId = 0;
};
