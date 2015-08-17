'use strict';

let ast = require('./ast'),
    utils = require('./utils'),
    config = require('./config'),
    walk = ast.walk;

let literalMap;

function replaceLiteral(ast, _literalMap) {
  literalMap = _literalMap;
  _walk(ast);
}

function _walk(node) {
  walk(node, (node) => {
    if (node.type === 'Literal') {
      let uglyId;
      if (uglyId = literalMap.get(node.value)) {
        utils.assignObj(node, {
          type: 'Identifier',
          name: uglyId
        });
      }
    } else if (node.type === 'ObjectExpression') {
      for (let prop of node.properties) _walk(prop.value);
    } else {
      for (let key in node) _walk(node[key]);
    }
  });
}

function encodeKey(key) {
  let uglyId = literalMap.get(key.name);
  if (uglyId) key.name = uglyId;
}

module.exports = replaceLiteral;
