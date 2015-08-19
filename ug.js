'use strict';

var getLiteralSet = require('./getLiteralSet'),
    idGen = require('./idGen'),
    replace = require('./replace'),
    utils = require('./utils'),
    config = require('./config'),
    replaceOuter = require('./replaceOuter'),
    Map = require('./Map');

config.defined = ['window', 'undefined'];

function ug(ast) {
  var literalSet = getLiteralSet(ast),
      literalMap = new Map,
      definedMap = new Map;
  idGen.init();
  config.thisId = idGen.next();
  replaceOuter(ast.body);
  literalSet.forEach(function (item) {
    literalMap.set(item, idGen.next());
  });
  config.defined.forEach(function (item) {
    definedMap.set(item, idGen.next());
  });
  console.log(JSON.stringify(ast, null, 2));
  replace(ast, literalMap, definedMap);
  console.log(JSON.stringify(ast, null, 2));
  return wrap(ast, literalMap, definedMap);
}

function wrap(ast, literalMap, definedMap) {
  var args = [],
      params = [],
      bodys = [],
      varMap = new Map;
  args.push({
    type: 'ThisExpression'
  });
  params.push({
    type: 'Identifier',
    name: config.thisId
  });
  definedMap.forEach(function (item) {
    args.push({
      type: 'Identifier',
      name: item[0]
    });
    params.push({
      type: 'Identifier',
      name: item[1]
    });
  });
  literalMap.forEach(function (item) {
    args.push({
      type: 'Literal',
      value: item[0]
    });
    params.push({
      type: 'Identifier',
      name: item[1]
    });
  });
  ast.body.forEach(function (item) {
    bodys.push(item);
  });
  return {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'FunctionExpression',
            id: null,
            params: params,
            defaults: [],
            body: {
              type: 'BlockStatement',
              body: bodys
            },
            generator: false,
            expression: false
          },
          arguments: args
        }
      }
    ]
  };
}

module.exports = ug;
