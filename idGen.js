'use strict';

let config = require('./config');

let nextId = 0;

exports.next = () => {
  return config.prefix + nextId++;
};
