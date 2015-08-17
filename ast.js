'use strict';

exports.isDecl = (node) => {
  return (node.type === 'VariableDeclarator' ||
          node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression') &&
          node.id && node.id.name;
}

exports.isFunc = (node) => {
  return node.type === 'FunctionDeclaration' ||
         node.type === 'FunctionExpression';
}

exports.walk = function walk(node, cb) {
  if (node instanceof Array) {
    for (let item of node) walk(item, cb);
  } else if (typeof node === 'object' && node !== null) {
    cb(node);
  }
}
