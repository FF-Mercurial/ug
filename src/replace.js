'use strict';

var ast = require('./ast'),
    _ = require('./util'),
    config = require('./config'),
    walk = ast.walk;

var literalMap, definedMap;

function replace(ast, _literalMap, _definedMap) {
  literalMap = _literalMap;
  definedMap = _definedMap;
  _walk(ast);
}

function _walk(node) {
  walk(node, function (node) {
    var uglyId;
    // replace literal
    if (node.type === 'Literal' && !node.regex) {
      if (uglyId = literalMap.get(node.value)) {
        _.assignObj(node, {
          type: 'Identifier',
          name: uglyId
        });
      }
    // replace defined id
    } else if (node.type === 'Identifier') {
      if (uglyId = definedMap.get(node.name)) {
        node.name = uglyId;
      }
    // don't treat keys of object literal as literals
    } else if (node.type === 'Property') {
      _walk(node.value);
    } else {
      Object.getOwnPropertyNames(node).forEach(function (key) {
        _walk(node[key]);
      });
    }
  });
}

module.exports = replace;