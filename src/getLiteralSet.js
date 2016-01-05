/**
 * walk ast
 * 1. rewrite globalVar -> window['globalVar'] 
 *    (then we cantreat global var as literal)
 * 2. find other literal(explicit literal and obj.prop)
 */

'use strict';

var ast = require('./ast'),
    getDeclSet = require('./getDeclSet'),
    _ = require('./util'),
    config = require('./config'),
    Set = require('./Set'),
    walk = ast.walk,
    isFunc = ast.isFunc;

var declSetStack, declSet, literalSet, inWith;

function getLiteralSet(ast) {
  declSet = new Set;
  config.defined.forEach(function (item) {
    declSet.add(item);
  });
  declSet.add(config.thisId);
  declSetStack = [];
  declSetStack.push(declSet);
  literalSet = new Set;
  inWith = false;
  _walk(ast);
  return literalSet;
}

function _walk(node) {
  walk(node, function (node) {
    // is function, push scope and walk body
    if (isFunc(node)) {
      declSetStack.push(declSet = _.unionSet(declSet, getDeclSet(node)));
      _walk(node.body);
      declSet = declSetStack.pop();
    // is catch clause, push scope and walk body
    } else if (node.type === 'CatchClause') {
      declSetStack.push(declSet = _.unionSet(declSet, getDeclSet(node)));
      _walk(node.body);
      declSet = declSetStack.pop();
    // rewrite obj.prop
    } else if (node.type === 'MemberExpression' && !node.computed) {
      literalSet.add(node.property.name);
      node.computed = true;
      node.property = {
        type: 'Literal',
        value: node.property.name
      };
      _walk(node.object);
    // explicit literal
    } else if (node.type === 'Literal') {
      // ignore 'use strict' and regex
      if (node.value !== 'use strict' && !node.regex) literalSet.add(node.value);
    } else if (node.type === 'VariableDeclarator') {
      _walk(node.init);
    // rewrite global var (don't rewrite in with statement or function used eval)
    } else if (node.type === 'Identifier' && !declSet.has(node.name) && !inWith && !getDeclSet.usedEval) {
      literalSet.add(node.name);
      _.assignObj(node, {
        type: 'MemberExpression',
        computed: true,
        object: {
          type: 'Identifier',
          name: config.thisId
        },
        property: {
          type: 'Literal',
          value: node.name
        }
      });
    // with statement
    } else if (node.type === 'WithStatement') {
      inWith = true;
      _walk(node.body);
      inWith = false;
    // ignore keys of object literals
    } else if (node.type === 'Property') {
      _walk(node.value);
    } else {
      Object.getOwnPropertyNames(node).forEach(function (key) {
        _walk(node[key]);
      });
    }
  });
}

module.exports = getLiteralSet;