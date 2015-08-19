'use strict';

exports.isDecl = function (node) {
  return (node.type === 'VariableDeclarator' ||
          node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression') &&
          node.id && node.id.name;
};

exports.isFunc = function (node) {
  return node.type === 'FunctionDeclaration' ||
         node.type === 'FunctionExpression';
};

exports.walk = function (node, cb) {
  if (node instanceof Array) {
    var i;
    for (i = 0; i < node.length; i++) cb(node[i], node, i);
  } else if (typeof node === 'object' && node !== null) {
    cb(node);
  }
};
