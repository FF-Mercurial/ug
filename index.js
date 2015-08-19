'use strict';

var parse = require('esprima').parse,
    gen = require('escodegen').generate,
    uglify = require('uglify-js').minify,
    fs = require('fs'),
    ug = require('./ug');

function fromStr(srcStr) {
  var srcAst = parse(srcStr),
      outAst = ug(srcAst),
      out = gen(outAst, { format: { indent: { style: '  ' } } });
  // return out;
  return uglify(out, { fromString: true }).code;
}

fromStr.inplace = function (file) {
  var src = fs.readFileSync(file),
      out = fromStr(src);
  fs.writeFileSync(file, out);
};

module.exports = fromStr;
