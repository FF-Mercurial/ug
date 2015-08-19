'use strict';

var ast = require('./ast'),
    config = require('./config'),
    utils = require('./utils'),
    walk = ast.walk,
    isFunc = ast.isFunc;

var funcDecls;

function replaceOuter(body) {
  funcDecls = [];
  _walk(body);
  funcDecls.reverse().forEach(function (decl) {
    body.splice(0, 0, decl);
  });
}

function _walk(node) {
  walk(node, function (node, parent, index) {
    if (node.type === 'ThisExpression') {
      utils.assignObj(node, {
        type: 'Identifier',
        name: config.thisId
      });
    // rewrite 'function a() {}' to 'window['a'] = function () {}' (bubbling to top)
    } else if (node.type === 'FunctionDeclaration') {
      funcDecls.push({
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'MemberExpression',
            computed: true,
            object: {
              type: 'Identifier',
              name: 'window'
            },
            property: {
              type: 'Literal',
              value: node.id.name
            }
          },
          right: {
            type: 'FunctionExpression',
            id: null,
            params: node.params,
            defaults: node.defaults,
            body: node.body,
            generator: node.generator,
            expression: node.expression
          }
        }
      });
      parent.splice(index, 1);
    // rewrite 'var a, b = 'b', c' to 'window['b'] = 'b''
    } else if (node.type === 'VariableDeclaration') {
      var args = [index, 1];
      node.declarations.forEach(function (decl) {
        if (decl.init) {
          args.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'MemberExpression',
                computed: true,
                object: {
                  type: 'Identifier',
                  name: 'window'
                },
                property: {
                  type: 'Literal',
                  value: decl.id.name
                }
              },
              right: decl.init
            }
          });
        }
      });
      parent.splice.apply(parent, args)
    // rewrite this
    } else if (node.type === 'ThisExpression') {
      utils.assignObj(node, {
        type: 'Identifier',
        name: config.thisId
      });
    // don't walk into functions
    } else if (!isFunc(node)) {
      Object.getOwnPropertyNames(node).forEach(function (key) {
        _walk(node[key]);
      });
    }
  });
}

module.exports = replaceOuter;
