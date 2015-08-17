'use strict';

let ast = require('./ast'),
    walk = ast.walk,
    isDecl = ast.isDecl,
    isFunc = ast.isFunc,
    declSet;

function getDeclSet(ast) {
  declSet = new Set;
  // is function, add 'arguments' and params to decl set, walk in the body
  if (isFunc(ast)) {
    declSet.add('arguments');
    for (let param of ast.params) declSet.add(param.name);
    _walk(ast.body);
  // is catch clause, add param to decl set, walk in the body
  } else if (ast.type === 'CatchClause') {
    declSet.add(ast.param.name);
    _walk(ast.body);
  // not function, walk in
  } else {
    _walk(ast);
  }
  return declSet;
}

function _walk(node) {
  walk(node, (node) => {
    let id;
    // found decl
    if (id = isDecl(node)) declSet.add(id);
    // don't walk in function
    if (!isFunc(node)) {
      for (let key in node) _walk(node[key]);
    }
  });
}

module.exports = getDeclSet;
