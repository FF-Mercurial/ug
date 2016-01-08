'use strict';

var parse = require('esprima').parse,
    gen = require('escodegen').generate,
    uglify = require('uglify-js').minify,
    fs = require('fs'),
    path = require('path'),
    ug = require('./ug');

function wrap(ugAst){
  if(ugAst && ugAst.body && ugAst.body.length && ugAst.body[0].expression && ugAst.body[0].expression.arguments){
    var charMap = {};
    var charArr = [];
    var tpl = fs.readFileSync(path.join(__dirname, 'template.js'));
    var tplAst = parse(tpl);
    var expression = tplAst.body[0].expression;
    expression.callee.body.body = ugAst.body;
    var MAP_FUNCTION_ID = expression.callee.params[0].name;
    var args = ugAst.body[0].expression.arguments;
    args.forEach(function(token, index){
      if(token.value && token.type === 'Literal' && typeof token.value === 'string'){
        var params = [];
        token.value.split('').forEach(function(c){
          if(!charMap.hasOwnProperty(c)){
            charMap[c] = charArr.length;
            charArr.push(c);
          }
          params.push({
            type: 'Literal',
            value: charMap[c],
            raw: '0x' + charMap[c].toString(16)
          });
        });
        token = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: MAP_FUNCTION_ID
          },
          arguments: params
        };
      }
      args[index] = token;
    });
    var params = [];
    charArr.forEach(function(c){
      params.push({
        type: 'Literal',
        value: c,
        raw: "'" + c + "'"
      });
    });
    expression.arguments[0].arguments[0].elements = params;
    return tplAst;
  }
}

function fromStr(srcStr) {
  var srcAst = parse(srcStr);
  // fs.writeFileSync('srcAst.json', JSON.stringify(srcAst, null, 2));
  var outAst = ug(srcAst);
  // fs.writeFileSync('ugAst.json', JSON.stringify(outAst, null, 2));
  var wrapAst = wrap(outAst);
  // fs.writeFileSync('wrapAst.json', JSON.stringify(outAst, null, 2));
  var out = gen(wrapAst, { format: { indent: { style: '  ' } } });
  // fs.writeFileSync('oout.js', out);
  // return out;
  return uglify(out, { fromString: true }).code;
}

fromStr.inplace = function (file) {
  var src = fs.readFileSync(file),
      out = fromStr(src);
  fs.writeFileSync(file, out);
};

module.exports = fromStr;