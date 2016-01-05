'use strict';

var parse = require('esprima').parse,
    gen = require('escodegen').generate,
    uglify = require('uglify-js').minify,
    fs = require('fs'),
    ug = require('./ug');

function fromStr(srcStr) {
  var srcAst = parse(srcStr);
  // fs.writeFileSync('srcAst.json', JSON.stringify(srcAst, null, 2));
  var outAst = ug(srcAst);
  // fs.writeFileSync('outAst.json', JSON.stringify(outAst, null, 2));
  var out = gen(outAst, { format: { indent: { style: '  ' } } });
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