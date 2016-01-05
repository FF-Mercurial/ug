'use strict';

var _ = require('./util');

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
    node.forEach(function (child) {
      cb(child);
    });
  } else if (typeof node === 'object' && node !== null) {
    cb(node);
  }
};

exports.clearNode = function (node, isExpression) {
  if (isExpression) {
    _.assignObj(node, {
      type: 'SequenceExpression',
      expressions: []
    });
  } else {
    _.assignObj(node, {
      type: 'EmptyStatement'
    });
  }
};