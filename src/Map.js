'use strict';

function Map() {
  this._keys = [];
  this._values = [];
}

var p = Map.prototype;

p.get = function (key) {
  return this._values[this._keys.indexOf(key)];
}

p.set = function (key, value) {
  var index = this._keys.indexOf(key);
  if (index === -1) {
    this._keys.push(key);
    this._values.push(value);
  } else {
    this._values[index] = value;
  }
}

p.forEach = function (cb) {
  var i;
  for (i = 0; i < this._keys.length; i++) cb([this._keys[i], this._values[i]]);
}

p.print = function() {
  console.log('Map>>>');
  this.forEach(function (item) {
    console.log(item[0] + ': ' + item[1]);
  });
  console.log('<<<Map');
}

module.exports = Map;
