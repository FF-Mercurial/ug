'use strict';

function Set() {
  this._items=  [];
}

var p = Set.prototype;

p.add = function (item) {
  if (this._items.indexOf(item) === -1) this._items.push(item);
}

p.forEach = function (cb) {
  this._items.forEach(cb);
}

p.has = function (item) {
  return this._items.indexOf(item) !== -1;
}

p.print = function () {
  console.log('Set>>>');
  this.forEach(function (item) {
    console.log(item);
  });
  console.log('<<<Set');
}

module.exports = Set;
