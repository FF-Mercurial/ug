'use strict';

var ast = require('./ast'),
    config = require('./config'),
    _ = require('./util'),
    walk = ast.walk,
    isFunc = ast.isFunc,
    clearNode = ast.clearNode;

var funcDecls;

function replaceOuter(body) {
  funcDecls = [];
  _walk(body);
  funcDecls.reverse().forEach(function (decl) {
    body.splice(0, 0, decl);
  });
}

function _walk(node, isExpression) {
  walk(node, function () {
    // replace this
    if (node.type === 'ThisExpression') {
      _.assignObj(node, {
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
              type: 'ThisExpression'
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
      clearNode(node);
    // rewrite 'var a, b = 'b', c' to 'this['b'] = 'b''
    } else if (node.type === 'VariableDeclaration') {
      var expressions = [];
      node.declarations.forEach(function (decl) {
        if (decl.init) {
          _walk(decl.init);
          expressions.push({
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              computed: true,
              object: {
                type: 'Identifier',
                name: config.thisId
              },
              property: {
                type: 'Literal',
                value: decl.id.name
              }
            },
            right: decl.init
          });
        }
      });
      if (expressions.length > 0) {
        _.assignObj(node, {
          type: 'SequenceExpression',
          expressions: expressions
        });
      } else {
        clearNode(node, isExpression);
      }
    // don't walk into functions
    } else if (!isFunc(node)) {
      Object.getOwnPropertyNames(node).forEach(function (key) {
        if (node.type === 'ForStatement' && key === 'init' ||
            node.type === 'ForInStatement' && key === 'left') {
          _walk(node[key], true);
        } else {
          _walk(node[key]);
        }
      });
    }
  });
}

module.exports = replaceOuter;