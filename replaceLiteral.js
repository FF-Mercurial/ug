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
    // replace literal
    if (node.type === 'Literal') {
      let uglyId;
      if (uglyId = literalMap.get(node.value)) {
        utils.assignObj(node, {
          type: 'Identifier',
          name: uglyId
        });
      }
    // don't treat keys of object literal as literals
    } else if (node.type === 'Property') {
      _walk(node.value);
    } else {
      for (let key in node) _walk(node[key]);
    }
  });
}

module.exports = replaceLiteral;
