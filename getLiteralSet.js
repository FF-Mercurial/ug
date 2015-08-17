/**
 * walk ast
 * 1. rewrite globalVar -> window['globalVar'] 
 *    (then we cantreat global var as literal)
 * 2. find other literal(explicit literal and obj.prop)
 */

'use strict';

let ast = require('./ast'),
    getDeclSet = require('./getDeclSet'),
    utils = require('./utils'),
    config = require('./config'),
    walk = ast.walk,
    isFunc = ast.isFunc;

let declSetStack, declSet, literalSet, inWith;

function getLiteralSet(ast) {
  declSetStack = [];
  declSetStack.push(declSet = getDeclSet(ast));
  declSet.add(config.windowId);
  literalSet = new Set;
  inWith = false;
  _walk(ast);
  return literalSet;
}

function _walk(node) {
  walk(node, (node) => {
    // is function, push scope and walk body
    if (isFunc(node)) {
      declSetStack.push(declSet = utils.unionSet(declSet, getDeclSet(node)));
      _walk(node.body);
      declSet = declSetStack.pop();
    // is catch clause, push scope and walk body
    } else if (node.type === 'CatchClause') {
       declSetStack.push(declSet = utils.unionSet(declSet, getDeclSet(node)));
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
      // ignore 'use strict'
      if (node.value !== 'use strict') literalSet.add(node.value);
    // rewrite global var (don't rewrite in with statement)
    } else if (node.type === 'Identifier' && !declSet.has(node.name) && !inWith) {
      literalSet.add(node.name);
      utils.assignObj(node, {
        type: 'MemberExpression',
        computed: true,
        object: {
          type: 'Identifier',
          name: config.windowId
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
      for (let key in node) _walk(node[key]);
    }
  });
}

module.exports = getLiteralSet;
