'use strict';

var ast = require('./ast'),
    config = require('./config'),
    Set = require('./Set'),
    walk = ast.walk,
    isDecl = ast.isDecl,
    isFunc = ast.isFunc,
    declSet;

function getDeclSet(ast) {
  declSet = new Set;
  // is function, add 'arguments' and params to decl set, walk into the body
  if (isFunc(ast)) {
    declSet.add('arguments');
    ast.params.forEach(function (param) {
      declSet.add(param.name);
    })
    _walk(ast.body);
  // is catch clause, add param to decl set, walk into the body
  } else if (ast.type === 'CatchClause') {
    declSet.add(ast.param.name);
    _walk(ast.body);
  // not function, walk into
  } else {
    _walk(ast);
  }
  return declSet;
}

function _walk(node) {
  // console.log('?');
  walk(node, function (node) {
    var id;
    // found decl
    if (id = isDecl(node)) declSet.add(id);
    // don't walk in function
    if (!isFunc(node)) {
      Object.getOwnPropertyNames(node).forEach(function (key) {
       _walk(node[key]); 
      });
    }
  });
  // console.log('!');
}

module.exports = getDeclSet;
