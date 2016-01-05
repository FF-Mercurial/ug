'use strict';

var prefix = '$' + ((Math.random() * 1000) >> 0) + '$',
    nextId = 0;

exports.next = function () {
  return prefix + nextId++;
};