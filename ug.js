'use strict';

let getLiteralSet = require('./getLiteralSet'),
    idGen = require('./idGen'),
    replaceLiteral = require('./replaceLiteral'),
    utils = require('./utils'),
    config = require('./config');

function ug(ast) {
  let literalSet = getLiteralSet(ast),
      literalMap = new Map;
  for (let item of literalSet) literalMap.set(item, idGen.next());
  for (let item of literalMap) {
    if (item[1] === '$$475') {
      // console.log(item[0]);
    }
  }
  replaceLiteral(ast, literalMap);
  return wrap(ast, literalMap);
}

function wrap(ast, literalMap) {
  let args = [],
      params = [],
      bodys = [];
  args.push({
    type: 'Identifier',
    name: config.browser ? 'window' : 'global'
  });
  params.push({
    type: 'Identifier',
    name: config.windowId
  });
  for (let item of literalMap) {
    args.push({
      type: 'Literal',
      value: item[0]
    });
    params.push({
      type: 'Identifier',
      name: item[1]
    });
  }
  for (let item of ast.body) bodys.push(item);
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
